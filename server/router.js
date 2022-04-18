const controllers = require('./controllers');

const router = (app) => {
  app.get('/', controllers.game.gamePage);
  app.get('/shop', controllers.shop.shopPage);
  app.post('/makeRoom', controllers.game.makeRoom);
  app.get('/getRooms', controllers.game.getRooms);
};

module.exports = router;
