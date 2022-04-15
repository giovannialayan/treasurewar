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
    gameManager.getRoom(gameManager.getPlayer(socket.id).room).numPlayers + 1,
  );

  // if this player is the first one in the room set up the game
  gameManager.tryFirstTimeRoomSetup(
    gameManager.getPlayer(socket.id).room,
    gameManager.getPlayer(socket.id),
    emitToRoom
  );

  console.log(`player ${socket.id} connected to room ${gameManager.getPlayer(socket.id).room}`);

  // send current treasure data to the player that just joined
  socket.emit('placeTreasures', gameManager.getRoom(gameManager.getPlayer(socket.id).room).treasures);

  // send all current players to the player than just joined
  socket.emit('currentPlayers', gameManager.getRoom(gameManager.getPlayer(socket.id).room).roomPlayers);

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

    if (gameManager.getRoom(gameManager.getPlayer(socket.id).room).treasures.length === 0) {
      gameManager.endGame(gameManager.getPlayer(socket.id).room, emitToRoom);
    }
  });
});
