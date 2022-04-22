const _ = require('underscore');

const letters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];
const worldDims = { width: 1000, height: 1000 };
const treasureDims = { width: 32, height: 32 };
const minChallengeLen = 5;
const maxChallengeLen = 8;

const players = {};
const rooms = {};
let roomIds = 0;

// end the game for a room and emit the players in the room in order of their score
const endGame = (room, callback) => {
  const playersScoreOrder = _.sortBy(Object.values(
    rooms[room].roomPlayers,
  ), (player) => player.score);

  for (let i = 0; i < playersScoreOrder.length; i++) {
    for (let j = 0; j < playersScoreOrder - i - 1; j++) {
      if (playersScoreOrder[j].score > playersScoreOrder[j + 1].score) {
        const temp = playersScoreOrder[j];
        playersScoreOrder[j] = playersScoreOrder[j + 1];
        playersScoreOrder[j + 1] = temp;
      }
    }
  }

  clearInterval(rooms[room].interval);

  callback(playersScoreOrder, room, 'playerWon');
};

// counts down a room's timer every second
const timer = (room, callback) => {
  rooms[room].timerSeconds--;
  callback(rooms[room].timerSeconds, room, 'timerTicked');
  if (rooms[room].timerSeconds <= 0) {
    clearInterval(rooms[room].interval);
    endGame(room, callback);
  }
};

const getPlayer = (id) => players[id];

const createPlayer = (id, room, skin) => {
  players[id] = {
    x: 500,
    y: 500,
    score: 0,
    playerId: id,
    room,
    skin,
  };

  rooms[room].roomPlayers[id] = players[id];
};

const getRoom = (id) => rooms[id];

const getRoomByPlayer = (id) => rooms[players[id].room];

const changeNumPlayerOfRoom = (id, num) => {
  rooms[id].numPlayers = num;
};

const disconnectPlayer = (id, callback) => {
  delete rooms[players[id].room].roomPlayers[id];
  rooms[players[id].room].numPlayers--;

  if (rooms[players[id].room].numPlayers <= 0) {
    clearInterval(rooms[players[id].room].interval);
    delete rooms[players[id].room];
  }

  const roomNum = players[id].room;

  delete players[id];

  callback(id, roomNum, 'playerDisconnected');
};

const changePlayerPosition = (id, movementData) => {
  players[id].x = movementData.x;
  players[id].y = movementData.y;
};

const collectTreasure = (id, treasureData) => {
  rooms[players[id].room].treasures
    .splice(rooms[players[id].room].treasures.findIndex(
      (treasure) => treasure._id === treasureData._id,
    ), 1);
  players[id].score++;
};

// get a random int
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

// create a keyboard challenge for a treasure
const createChallenge = (minLen, maxLen) => {
  const challengeArr = [];
  const challengeLen = getRandomInt(minLen, maxLen + 1);

  for (let i = 0; i < challengeLen; i++) {
    challengeArr.push(getRandomInt(0, letters.length));
  }

  return challengeArr;
};

// generate position, challenge, and id for a given number of treasures
const generateTreasures = (num, challMin, challMax) => {
  const genTreasures = [];

  for (let i = 0; i < num; i++) {
    genTreasures.push({ x: 0, y: 0, challenge: [] });
    genTreasures[i].x = getRandomInt(
      treasureDims.width / 2,
      worldDims.width - treasureDims.width / 2,
    );
    genTreasures[i].y = getRandomInt(
      treasureDims.height / 2,
      worldDims.height - treasureDims.height / 2,
    );
    genTreasures[i].challenge = createChallenge(challMin, challMax);
    genTreasures[i]._id = i;
  }

  return genTreasures;
};

const createRoom = (name, maxRoomPlayers, minPlayers, time, numTreasures, hardOn) => {
  roomIds++;
  rooms[roomIds] = {
    name,
    maxPlayers: maxRoomPlayers,
    minPlayers,
    timerSeconds: time * 60,
    startTime: time,
    numTreasures,
    hard: hardOn,
    _id: roomIds,
    roomJustMade: true,
    numPlayers: 0,
    roomPlayers: {},
  };

  rooms[roomIds].treasures = generateTreasures(
    rooms[roomIds].numTreasures,
    minChallengeLen,
    maxChallengeLen,
  );
};

const getRoomObj = () => {
  const roomList = Object.keys(rooms);
  const roomObj = {};

  for (let i = 0; i < roomList.length; i++) {
    roomObj[roomList[i]] = {
      name: rooms[roomList[i]].name,
      maxPlayers: rooms[roomList[i]].maxPlayers,
      minPlayers: rooms[roomList[i]].minPlayers,
      time: rooms[roomList[i]].startTime,
      numTreasures: rooms[roomList[i]].numTreasures,
      _id: rooms[roomList[i]]._id,
      currentPlayers: rooms[roomList[i]].numPlayers,
    };
  }

  return roomObj;
};

// start the game if the number of players is at least at the minimum number of players
const tryStartGame = (roomId, callback) => {
  if (rooms[roomId].numPlayers >= rooms[roomId].minPlayers) {
    rooms[roomId].interval = setInterval(() => {
      timer(roomId, callback);
    }, 1000);

    callback(true, roomId, 'startGame');
  }
};

module.exports = {
  getPlayer,
  getRoomObj,
  createRoom,
  endGame,
  collectTreasure,
  changePlayerPosition,
  disconnectPlayer,
  changeNumPlayerOfRoom,
  getRoom,
  createPlayer,
  getRoomByPlayer,
  tryStartGame,
};
