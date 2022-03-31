const controllers = require('./controllers');

const router = (app) => {
  app.get('/', controllers.game.gamePage);
};

module.exports = router;