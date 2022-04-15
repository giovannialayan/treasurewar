const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
// const helmet = require('helmet');
// const session = require('express-session');
const http = require('http');
const socketIO = require('socket.io');
const _ = require('underscore');

const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();

const server = http.Server(app);
const io = socketIO(server, {
  pingTimeout: 60000,
});

// app.use(helmet());
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

router(app);

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});

const letters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];
const worldDims = { width: 1000, height: 1000 };
const treasureDims = { width: 32, height: 32 };
const minChallengeLen = 5;
const maxChallengeLen = 8;

const players = {};
const rooms = {};
let roomIds = 0;

// end the game for a room and emit the players in the room in order of their score
const endGame = (room) => {
  const playersScoreOrder = _.sortBy(Object.values(
    rooms[room].roomPlayers,
  ), (player) => player.score);

  for (let i = 0; i < playersScoreOrder.length; i++) {
    for (let j = 0; j < playersScoreOrder - i - 1; j++) {
      if (playersScoreOrder[j].score > playersScoreOrder[j + 1].score) {
        const temp = playersScoreOrder[j];
        playersScoreOrder[j] = playersScoreOrder[j + 1];
        playersScoreOrder[j + 1] = temp;
      }
    }
  }

  clearInterval(rooms[room].interval);

  io.to(room).emit('playerWon', playersScoreOrder);
};

// counts down a room's timer every second
const timer = (room) => {
  rooms[room].timerSeconds--;
  io.to(room).emit('timerTicked', rooms[room].timerSeconds);
  if (rooms[room].timerSeconds <= 0) {
    clearInterval(rooms[room].interval);
    endGame(room);
  }
};

// get a random int
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

// create a keyboard challenge for a treasure
const createChallenge = (minLen, maxLen) => {
  const challengeArr = [];
  const challengeLen = getRandomInt(minLen, maxLen + 1);

  for (let i = 0; i < challengeLen; i++) {
    challengeArr.push(getRandomInt(0, letters.length));
  }

  return challengeArr;
};

// generate position, challenge, and id for a given number of treasures
const generateTreasures = (num, challMin, challMax) => {
  const genTreasures = [];

  for (let i = 0; i < num; i++) {
    genTreasures.push({ x: 0, y: 0, challenge: [] });
    genTreasures[i].x = getRandomInt(
      treasureDims.width / 2,
      worldDims.width - treasureDims.width / 2,
    );
    genTreasures[i].y = getRandomInt(
      treasureDims.height / 2,
      worldDims.height - treasureDims.height / 2,
    );
    genTreasures[i].challenge = createChallenge(challMin, challMax);
    genTreasures[i]._id = i;
  }

  return genTreasures;
};

// on connect event, sets up everything for the player than connected
io.on('connection', (socket) => {
  // create object for this player
  players[socket.id] = {
    x: 500,
    y: 500,
    score: 0,
    playerId: socket.id,
    room: socket.handshake.query.room,
  };

  // join the room this player should be in
  socket.join(players[socket.id].room);
  rooms[players[socket.id].room].numPlayers++;

  // if this player is the first one in the room set up the game
  if (rooms[players[socket.id].room].roomJustMade) {
    const roomToTime = players[socket.id].room;
    rooms[players[socket.id].room].interval = setInterval(() => {
      timer(roomToTime);
    }, 1000);
    rooms[players[socket.id].room].roomPlayers = {};
    rooms[players[socket.id].room].roomPlayers[socket.id] = players[socket.id];
    rooms[players[socket.id].room].roomJustMade = false;
  }

  console.log(`player ${socket.id} connected to room ${players[socket.id].room}`);

  // send current treasure data to the player that just joined
  socket.emit('placeTreasures', rooms[players[socket.id].room].treasures);

  // send all current players to the player than just joined
  // socket.to(players[socket.id].room).emit('currentPlayers', players);
  socket.emit('currentPlayers', players);

  // send this player's data to all other players
  socket.broadcast.to(players[socket.id].room).emit('newPlayer', players[socket.id]);

  // when this player disconnects remove them from the room,
  // delete their data and send to all other players the id to delete
  socket.on('disconnect', () => {
    console.log(`player ${socket.id} disconnected`);
    delete rooms[players[socket.id].room].roomPlayers[socket.id];
    rooms[players[socket.id].room].numPlayers--;

    if (rooms[players[socket.id].room].numPlayers <= 0) {
      clearInterval(rooms[players[socket.id].room].interval);
      delete rooms[players[socket.id].room];
    }

    const roomNum = players[socket.id].room;

    delete players[socket.id];

    io.to(roomNum).emit('playerDisconnected', socket.id);
  });

  // when this player moves send the movement data to all other players
  socket.on('playerMovement', (movementData) => {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;

    socket.broadcast.to(players[socket.id].room).emit('playerMoved', players[socket.id]);
  });

  // when this player collects a treasure, remove it from the room's treasures,
  // send to all other players the treasure to delete
  socket.on('treasureCollected', (treasureData) => {
    rooms[players[socket.id].room].treasures
      .splice(rooms[players[socket.id].room].treasures.findIndex(
        (treasure) => treasure._id === treasureData._id,
      ), 1);
    players[socket.id].score++;

    socket.broadcast.to(players[socket.id].room).emit('treasureRemoved', treasureData);

    if (rooms[players[socket.id].room].treasures.length === 0) {
      endGame(players[socket.id].room);
    }
  });
});

const createRoom = (name, maxRoomPlayers, minPlayers, time, numTreasures, hardOn) => {
  roomIds++;
  rooms[roomIds] = {
    name,
    maxPlayers: maxRoomPlayers,
    minPlayers,
    timerSeconds: time * 60,
    startTime: time,
    numTreasures,
    hard: hardOn,
    _id: roomIds,
    roomJustMade: true,
    numPlayers: 0,
  };

  rooms[roomIds].treasures = generateTreasures(rooms[roomIds].numTreasures, minChallengeLen, maxChallengeLen);
};

const getRoomObj = () => {
  let roomList = Object.keys(rooms);
  let roomObj = {};

  for(let i = 0; i < roomList.length; i++) {
    roomObj[roomList[i]] = {
      name: rooms[roomList[i]].name, 
      maxPlayers: rooms[roomList[i]].maxPlayers, 
      minPlayers: rooms[roomList[i]].minPlayers, 
      time: rooms[roomList[i]].startTime,
      numTreasures: rooms[roomList[i]].numTreasures,
      _id: rooms[roomList[i]]._id,
      currentPlayers: rooms[roomList[i]].numPlayers,
    };
  }

  return roomObj;
};

module.exports = {
  createRoom,
  getRoomObj,
};