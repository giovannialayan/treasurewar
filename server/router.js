const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // get csrf token
  app.get('/getToken', mid.requiresSecure, controllers.account.getToken);

  // go to login page
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.account.loginPage);
  // go to home page
  app.get('/home', mid.requiresSecure, mid.requiresLogin, controllers.account.homePage);
  // go to game page
  app.get('/game', mid.requiresSecure, mid.requiresLogin, controllers.game.gamePage);
  // go to shop page
  app.get('/shop', mid.requiresSecure, mid.requiresLogin, controllers.shop.shopPage);
  // go to account page
  app.get('/account', mid.requiresSecure, mid.requiresLogin, controllers.account.accountPage);
  // go to leaderboard page
  app.get('/leaderboard', mid.requiresSecure, mid.requiresLogin, controllers.leaderboard.boardPage);

  // create a new room
  app.post('/makeRoom', mid.requiresSecure, mid.requiresLogin, controllers.game.makeRoom);
  // get all current rooms
  app.get('/getRooms', mid.requiresSecure, mid.requiresLogin, controllers.game.getRooms);

  // log in user
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.account.login);
  // create new user
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.account.signup);
  // log out user
  app.get('/logout', mid.requiresSecure, mid.requiresLogin, controllers.account.logout);
  // change user's password
  app.post('/changePass', mid.requiresSecure, mid.requiresLogin, controllers.account.changePassword);

  // get account info of user
  app.get('/getAccount', mid.requiresSecure, mid.requiresLogin, controllers.account.getAccountInfo);
  // change the equipped skin of the user
  app.post('/equipSkin', mid.requiresSecure, mid.requiresLogin, controllers.account.equipSkin);

  // get all shop items in the database
  app.get('/getShopItems', mid.requiresSecure, mid.requiresLogin, controllers.shop.getShopItems);
  // add a shop item to the user's account
  app.post('/buyItem', mid.requiresSecure, mid.requiresLogin, controllers.account.addItemToAccount);
  // create a new shop item in the database
  app.post('/makeShopItem', mid.requiresSecure, mid.requiresAdmin, controllers.shop.makeShopItem);

  // get players ordered by wins and top three finishes
  app.get('/getLeaderboard', mid.requiresSecure, mid.requiresLogin, controllers.leaderboard.getLeaderboard);

  // 404 page
  app.get('*', (req, res) => { res.render('notFound'); });
};

module.exports = router;
