const gameManager = require('../gameManager.js');

// render game page
const gamePage = (req, res) => res.render('game');

// create a new room
const makeRoom = (req, res) => {
  if (!req.body.name || !req.body.maxPlayers || !req.body.minPlayers
    || !req.body.time || !req.body.numTreasures || !req.body.size) {
    return res.status(400).json({ error: 'name, maxplayers, minplayers, time, and hardon are required' });
  }

  const roomId = gameManager.createRoom(
    req.body.name,
    req.body.maxPlayers,
    req.body.minPlayers,
    req.body.time,
    req.body.numTreasures,
    req.body.hardOn,
    req.body.size,
  );

  return res.status(201).json({ roomId });
};

// get all the current rooms
const getRooms = (req, res) => {
  res.json({ roomObject: gameManager.getRoomObj() });
};

module.exports = {
  gamePage,
  makeRoom,
  getRooms,
};
