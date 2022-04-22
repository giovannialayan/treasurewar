const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
// const helmet = require('helmet');
const session = require('express-session');
const http = require('http');
const socketIO = require('socket.io');
// const _ = require('underscore');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const csrf = require('csurf');
const gameManager = require('./gameManager');
const config = require('./config.js');

const router = require('./router.js');

mongoose.connect(process.env.MONGODB_URI, (err) => {
  if (err) {
    console.log('could not connect to database');
    throw err;
  }
});

const redisClient = redis.createClient({
  legacyMode: true,
  url: process.env.REDISCLOUD_URL,
});
redisClient.connect().catch(console.error);

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

app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    client: redisClient,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));

app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }

  console.log('missing csrf token');
  return false;
});

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
  gameManager.createPlayer(socket.id, socket.handshake.query.room, socket.handshake.query.skin);

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
