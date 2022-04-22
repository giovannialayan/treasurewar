const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.account.getToken);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.account.loginPage);
  app.get('/game', mid.requiresSecure, mid.requiresLogin, controllers.game.gamePage);
  app.get('/shop', mid.requiresSecure, mid.requiresLogin, controllers.shop.shopPage);
  app.get('/account', mid.requiresSecure, mid.requiresLogin, controllers.account.accountPage);
  app.get('/leaderboard', mid.requiresSecure, mid.requiresLogin, controllers.leaderboard.boardPage);

  app.post('/makeRoom', mid.requiresSecure, mid.requiresLogin, controllers.game.makeRoom);
  app.get('/getRooms', mid.requiresSecure, mid.requiresLogin, controllers.game.getRooms);

  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.account.signup);
  app.get('/logout', mid.requiresSecure, mid.requiresLogin, controllers.account.logout);
  app.post('/changePass', mid.requiresSecure, mid.requiresLogin, controllers.account.changePassword);

  app.get('/getAccount', mid.requiresSecure, mid.requiresLogin, controllers.account.getAccountInfo);
  app.post('/equipSkin', mid.requiresSecure, mid.requiresLogin, controllers.account.equipSkin);

  app.get('/getShopItems', mid.requiresSecure, mid.requiresLogin, controllers.shop.getShopItems);
  app.post('/buyItem', mid.requiresSecure, mid.requiresLogin, controllers.account.addItemToAccount);
  app.post('/makeShopItem', mid.requiresSecure, mid.requiresLogin, controllers.shop.makeShopItem);

  app.get('/getLeaderboard', mid.requiresSecure, mid.requiresLogin, controllers.leaderboard.getLeaderboard);
};

module.exports = router;
