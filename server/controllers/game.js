const app = require('../app.js');

const gamePage = (req, res) => res.render('game');

const makeRoom = (req, res) => {
  if (!req.body.name || !req.body.maxPlayers || !req.body.minPlayers
    || !req.body.time || !req.body.hardOn) {
    return res.status(400).json({ error: 'name, maxplayers, minplayers, time, and hardon are required' });
  }

  const roomId = app.makeRoom(
    req.body.name,
    req.body.maxPlayers,
    req.body.minPlayers,
    req.body.time,
    req.body.hardOn,
  );

  return res.status(201).json({ roomId });
};

const joinRoom = (req, res) => {
  if (!req.body.roomId) {
    return res.status(400).json({ error: 'roomid required' });
  }
  return res.status(200);
};

const getRooms = (req, res) => res.json(app.getRooms());

module.exports = {
  gamePage,
  makeRoom,
  joinRoom,
  getRooms,
};
