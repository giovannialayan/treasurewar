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
// const _ = require('underscore');
const gameManager = require('./gameManager');
const config = require('./config.js');

const router = require('./router.js');

const app = express();

const server = http.Server(app);
const io = socketIO(server, {
  pingTimeout: 60000,
});

// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       "script-src": ["'self'"],
//       "img-src": ["'self'"]
//     }
//   }
// }));
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

server.listen(config.connections.http.port, () => {
  console.log(`listening on port ${config.connections.http.port}`);
});

const emitToRoom = (data, room, event) => {
  io.to(room).emit(event, data);
};

// on connect event, sets up everything for the player than connected
io.on('connection', (socket) => {
  // create object for this player
  gameManager.createPlayer(socket.id, socket.handshake.query.room);

  // join the room this player should be in
  socket.join(gameManager.getPlayer(socket.id).room);
  gameManager.changeNumPlayerOfRoom(
    gameManager.getPlayer(socket.id).room,
    gameManager.getRoomByPlayer(socket.id).numPlayers + 1,
  );

  // if the conditions for starting the game have been met, start the game
  gameManager.tryStartGame(gameManager.getPlayer(socket.id).room, emitToRoom);

  console.log(`player ${socket.id} connected to room ${gameManager.getPlayer(socket.id).room}`);

  // send current treasure data to the player that just joined
  socket.emit('placeTreasures', gameManager.getRoomByPlayer(socket.id).treasures);

  // send all current players to the player than just joined
  socket.emit('currentPlayers', gameManager.getRoomByPlayer(socket.id).roomPlayers);

  // send this player's data to all other players
  socket.broadcast.to(gameManager.getPlayer(socket.id).room).emit('newPlayer', gameManager.getPlayer(socket.id));

  // when this player disconnects remove them from the room,
  // delete their data and send to all other players the id to delete
  socket.on('disconnect', () => {
    console.log(`player ${socket.id} disconnected`);
    gameManager.disconnectPlayer(socket.id, emitToRoom);
  });

  // when this player moves send the movement data to all other players
  socket.on('playerMovement', (movementData) => {
    gameManager.changePlayerPosition(socket.id, movementData);

    socket.broadcast.to(gameManager.getPlayer(socket.id).room).emit('playerMoved', gameManager.getPlayer(socket.id));
  });

  // when this player collects a treasure, remove it from the room's treasures,
  // send to all other players the treasure to delete
  socket.on('treasureCollected', (treasureData) => {
    gameManager.collectTreasure(socket.id, treasureData);

    socket.broadcast.to(gameManager.getPlayer(socket.id).room).emit('treasureRemoved', treasureData);

    if (gameManager.getRoomByPlayer(socket.id).treasures.length === 0) {
      gameManager.endGame(gameManager.getPlayer(socket.id).room, emitToRoom);
    }
  });
});
