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

let timerSeconds = 0;

let players = {};
let treasures = [];

const startTimer = () => {
  const timer = () => {
    timerSeconds--;
    io.emit('timerTicked', timerSeconds);
  };

  timer();

  if(timerSeconds > 0) {
    setInterval(timer, 1000);
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
    genTreasures.challenge = createChallenge(challMin, challMax);
    genTreasures.id = i;
  }

  return genTreasures;
}

io.on('connection', (socket) => {
  console.log(`player ${socket.id} connected`);

  if(_.isEmpty(players)) {
    timerSeconds = timerSecondsInitial;
    startTimer();

    treasures = generateTreasures(totalNumTreasures, minChallengeLen, maxChallengeLen);
  }

  players[socket.id] = {
    x: 500,
    y: 500,
    playerId: socket.id,
  };

  socket.emit('placeTreasures', treasures);

  socket.emit('currentPlayers', players);
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('disconnect', () => {
      console.log(`player ${socket.id} disconnected`);
      delete players[socket.id];
      io.emit('playerDisconnected', socket.id);
  });

  socket.on('playerMovement', (movementData) => {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });

  socket.on('treasureCollected', (treasureData) => {
    treasures.splice(treasures.indexOf(treasureData), 1);

    socket.broadcast.emit('treasureRemoved', treasureData);
  });
});

// app.listen(port, (err) => {
//   if (err) {
//     throw err;
//   }
//   console.log(`listening on port ${port}`);
// });