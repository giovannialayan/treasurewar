const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const helmet = require('helmet');
const session = require('express-session');
const http = require('http');
const socketIO = require('socket.io');
const _ = require('underscore');

const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();

let server = http.Server(app);
let io = socketIO(server, {
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

server.listen(port, (req, res) => {
  console.log(`listening on port ${port}`);
})

const letters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];
const timerSecondsInitial = 240;
const worldDims = {width: 1000, height: 1000};
const treasureDims = {width: 32, height: 32};
const totalNumTreasures = 10;
const minChallengeLen = 5;
const maxChallengeLen = 8;
const maxPlayers = 10;

let players = {};
let rooms = [];

//start a timer than counts down a room's timer every second
const startTimer = (room) => {
  const timer = (room) => {
    rooms[room].timerSeconds--;
    io.to(room).emit('timerTicked', room[room].timerSeconds);

    if(rooms[room].timerSeconds <= 0) {
      clearInterval(rooms[room].interval);
      endGame(room);
    }
  };

  timer(room);
  rooms[room].interval = setInterval(() => {timer(room)}, 1000);
};

//get a random int
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

//create a keyboard challenge for a treasure
const createChallenge = (minLen, maxLen) => {
  let challengeArr = [];
  let challengeLen = getRandomInt(minLen, maxLen + 1);

  for(let i = 0; i < challengeLen; i++) {
    challengeArr.push(getRandomInt(0, letters.length));
  }

  return challengeArr;
}

//generate position, challenge, and id for a given number of treasures
const generateTreasures = (num, challMin, challMax) => {
  let genTreasures = [];

  for(let i = 0; i < num; i++) {
    genTreasures.push({x: 0, y: 0, challenge: []});
    genTreasures[i].x = getRandomInt(treasureDims.width / 2, worldDims.width - treasureDims.width / 2);
    genTreasures[i].y = getRandomInt(treasureDims.height / 2, worldDims.height - treasureDims.height / 2);
    genTreasures[i].challenge = createChallenge(challMin, challMax);
    genTreasures[i]._id = i;
  }

  return genTreasures;
}

//end the game for a room and emit the players in the room in order of their score
const endGame = (room) => {
  const playersScoreOrder = _.sortBy(Object.values(rooms[room].roomPlayers), (player) => {
    return player.score;
  });

  io.to(room).emit('playerWon', playersScoreOrder);
};

//todo: make it so you cant connect after the game has started after you make it so you can create rooms and the game starts only after a certain number of players have joined

//on connect event, sets up everything for the player than connected
io.on('connection', (socket) => {
  //find a room that isnt full or make a new room if they are all full
  let playerRoom = 0;
  for(let i = 0; i < rooms.length; i++) {
    if(rooms[i].numPlayers < maxPlayers) {
      rooms[i].numPlayers++;
      playerRoom = i;
      break;
    }
    else if(i === rooms.length - 1) {
      rooms.push({numPlayers: 0});
    }
  }

  //create object for this player
  players[socket.id] = {
    x: 500,
    y: 500,
    score: 0,
    playerId: socket.id,
    room: playerRoom,
  };

  //join the room this player should be in
  socket.join(players[socket.id].room);

  //if this player is the first one in the room set up the game
  if(rooms[players[socket.id].room].numPlayers === 1) {
    rooms[players[socket.id].room].timerSeconds = timerSecondsInitial;
    rooms[players[socket.id].room].interval = startTimer(players[socket.id].room);
    rooms[players[socket.id].room].roomPlayers = players[socket.id];
    rooms[players[socket.id].room].treasures = generateTreasures(totalNumTreasures, minChallengeLen, maxChallengeLen);
  }

  console.log(`player ${socket.id} connected to room ${players[socket.id].room}`);

  //send current treasure data to the player that just joined
  socket.to(players[socket.id].room).emit('placeTreasures', rooms[players[socket.id].room].treasures);

  //send all current players to the player than just joined
  socket.to(players[socket.id].room).emit('currentPlayers', players);

  //send this player's data to all other players
  socket.broadcast.to(players[socket.id].room).emit('newPlayer', players[socket.id]);

  //when this player disconnects remove them from the room, delete their data and send to all other players the id to delete
  socket.on('disconnect', () => {
      console.log(`player ${socket.id} disconnected`);
      delete rooms[players[socket.id].room].players[socket.id];
      rooms[players[socket.id].room].numPlayers--;

      if(rooms[players[socket.id].room].numPlayers <= 0) {
        rooms.pop();
      }

      delete players[socket.id];

      io.to(roomNum).emit('playerDisconnected', socket.id);
  });

  //when this player moves send the movement data to all other players
  socket.on('playerMovement', (movementData) => {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    
    socket.broadcast.to(players[socket.id].room).emit('playerMoved', players[socket.id]);
  });

  //when this player collects a treasure, remove it from the room's treasures, send to all other players the treasure to delete
  socket.on('treasureCollected', (treasureData) => {
    rooms[players[socket.id].room].treasures.splice(rooms[players[socket.id].room].treasures.indexOf(treasureData), 1);
    players[socket.id].score++;

    socket.broadcast.to(players[socket.id].room).emit('treasureRemoved', treasureData);

    if(treasures.length === 0) {
      endGame();
    }
  });
});

// app.listen(port, (err) => {
//   if (err) {
//     throw err;
//   }
//   console.log(`listening on port ${port}`);
// });