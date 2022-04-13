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
const totalNumTreasures = 2;
const minChallengeLen = 5;
const maxChallengeLen = 8;
const maxPlayers = 10;

let timerSeconds = 0;
let interval;

let players = {};
let treasures = [];
let rooms = [];

const startTimer = () => {
  const timer = () => {
    timerSeconds--;
    io.emit('timerTicked', timerSeconds);

    if(timerSeconds <= 0) {
      endGame();
    }
  };

  timer();

  if(timerSeconds > 0) {
    interval = setInterval(timer, 1000);
  }
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const createChallenge = (minLen, maxLen) => {
  let challengeArr = [];
  let challengeLen = getRandomInt(minLen, maxLen + 1);

  for(let i = 0; i < challengeLen; i++) {
    challengeArr.push(getRandomInt(0, letters.length));
  }

  return challengeArr;
}

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

const endGame = () => {
  const playersScoreOrder = _.sortBy(Object.values(players), (player) => {
    return player.score;
  });

  // for(let i = 0; i < playersScoreOrder.length; i++) {
  //   for(let j = 0; j < playersScoreOrder - i - 1; j++) {
  //     if(playersScoreOrder[j].score > playersScoreOrder[j + 1].score) {
  //       let temp = playersScoreOrder[j];
  //       playersScoreOrder[j] = playersScoreOrder[j + 1];
  //       playersScoreOrder[j + 1] = temp;
  //     }
  //   }
  // }

  clearInterval(interval);

  io.emit('playerWon', playersScoreOrder);
};

//remember to make it so you cant connect after the game has started after you make it so there are rooms and room options
io.on('connection', (socket) => {
  if(_.isEmpty(players)) {
    timerSeconds = timerSecondsInitial;
    startTimer();

    treasures = generateTreasures(totalNumTreasures, minChallengeLen, maxChallengeLen);
    rooms.push(0);
  }

  let playerRoom = 0;
  for(let i = 0; i < rooms.length; i++) {
    if(rooms[i] < maxPlayers) {
      rooms[i]++;
      playerRoom = i;
      break;
    }
    else if(i === rooms.length - 1) {
      rooms.push(0);
    }
  }

  players[socket.id] = {
    x: 500,
    y: 500,
    score: 0,
    playerId: socket.id,
    room: playerRoom,
  };

  console.log(`player ${socket.id} connected to room ${players[socket.id].room}`);

  socket.emit('placeTreasures', treasures);

  socket.emit('currentPlayers', players);
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('disconnect', () => {
      console.log(`player ${socket.id} disconnected`);
      delete players[socket.id];
      numPlayers--;
      io.emit('playerDisconnected', socket.id);
  });

  socket.on('playerMovement', (movementData) => {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });

  socket.on('treasureCollected', (treasureData) => {
    treasures.splice(treasures.indexOf(treasureData), 1);
    players[socket.id].score++;

    socket.broadcast.emit('treasureRemoved', treasureData);

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