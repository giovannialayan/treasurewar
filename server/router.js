const controllers = require('./controllers');

const router = (app) => {
  app.get('/', controllers.game.gamePage);
  app.post('/makeRoom', controllers.game.makeRoom);
  app.post('/joinRoom', controllers.game.joinRoom);
  app.get('/getRooms', controllers.game.getRooms);
};

module.exports = router;
