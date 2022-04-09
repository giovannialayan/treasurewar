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

let players = {};

io.on('connection', (socket) => {
  console.log(`player ${socket.id} connected`);

  players[socket.id] = {
    x: 500,
    y: 500,
    playerId: socket.id,
  }

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
});

// app.listen(port, (err) => {
//   if (err) {
//     throw err;
//   }
//   console.log(`listening on port ${port}`);
// });