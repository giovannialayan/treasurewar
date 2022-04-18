const controllers = require('./controllers');

const router = (app) => {
  app.get('/', controllers.game.gamePage);
  app.get('/shop', controllers.shop.shopPage);
  app.get('/account', controllers.account.accountPage);
  app.get('/leaderboard', controllers.leaderboard.boardPage);
  app.post('/makeRoom', controllers.game.makeRoom);
  app.get('/getRooms', controllers.game.getRooms);
};

module.exports = router;
