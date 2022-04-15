const gamePage = (req, res) => res.render('game');

const makeRoom = (req, res) => {
  if (!req.body.name || !req.body.maxPlayers || !req.body.minPlayers
    || !req.body.time || !req.body.numTreasures) {
    return res.status(400).json({ error: 'name, maxplayers, minplayers, time, and hardon are required' });
  }

  const app = require('../app.js');
  const roomId = app.createRoom(
    req.body.name,
    req.body.maxPlayers,
    req.body.minPlayers,
    req.body.time,
    req.body.numTreasures,
    req.body.hardOn,
  );

  return res.status(201).json({ roomId });
};

const getRooms = (req, res) => {
  const app = require('../app.js');
  res.json({roomObject: app.getRoomObj()});
};

module.exports = {
  gamePage,
  makeRoom,
  getRooms,
};
