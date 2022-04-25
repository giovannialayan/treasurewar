const _ = require('underscore');
const models = require('./models');

const { Account } = models;

const letters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];
const treasureDims = { width: 32, height: 32 };
const minChallengeLen = 5;
const maxChallengeLen = 8;

const players = {};
const rooms = {};
let roomIds = 0;

// save win and top three data to database
const saveDataToAccounts = async (users) => {
  try {
    let doc;
    let doc2;
    let doc3;

    switch (users.length) {
      case 1:
        doc = await Account.findOne({ username: users[0].name });
        doc.wins++;
        doc.topThrees++;
        doc.save();
        break;

      case 2:
        doc = await Account.findOne({ username: users[0].name });
        doc.wins++;
        doc.topThrees++;
        await doc.save();

        doc2 = await Account.findOne({ username: users[1].name });
        doc2.topThrees++;
        if (users[0].score === users[1].score) {
          doc2.wins++;
        }
        await doc2.save();
        break;

      default:
        doc = await Account.findOne({ username: users[0].name });
        doc.wins++;
        doc.topThrees++;
        await doc.save();

        doc2 = await Account.findOne({ username: users[1].name });
        doc2.topThrees++;
        if (users[0].score === users[1].score) {
          doc2.wins++;
        }
        await doc2.save();

        doc3 = await Account.findOne({ username: users[2].name });
        doc3.topThrees++;
        if (users[0].score === users[2].score) {
          doc3.wins++;
        }
        await doc3.save();
        break;
    }

    const usernames = users.map((user) => user.name);

    await Account.updateMany({ username: { $in: usernames } }, { $inc: { gamesPlayed: 1 } });
  } catch (err) {
    console.log(err, 'gameManager ln70');
  }
};

// end the game for a room and emit the players in the room in order of their score
const endGame = (room, callback) => {
  const playersScoreOrder = _.sortBy(Object.values(
    rooms[room].roomPlayers,
  ), (player) => player.score).reverse();

  clearInterval(rooms[room].interval);

  rooms[room].ended = true;

  saveDataToAccounts(playersScoreOrder);

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

// get player object by player id
const getPlayer = (id) => players[id];

// create new player and add them to the room
const createPlayer = (id, room, skin, name) => {
  players[id] = {
    x: rooms[room].worldDims.width / 2,
    y: rooms[room].worldDims.height / 2,
    score: 0,
    playerId: id,
    room,
    skin,
    name,
    flip: false,
  };

  rooms[room].roomPlayers[id] = players[id];
};

// get room object by room id
const getRoom = (id) => rooms[id];

// get room object by player id
const getRoomByPlayer = (id) => rooms[players[id].room];

// change number of players in a room
const changeNumPlayerOfRoom = (id, num) => {
  rooms[id].numPlayers = num;
};

// remove player from room and player objects and destroy the room if there are no players left
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

// change player positions and set player orientation based on last position
const changePlayerPosition = (id, movementData) => {
  players[id].flip = movementData.x < players[id].x;

  players[id].x = movementData.x;
  players[id].y = movementData.y;
};

// remove treasure from room and add to player score
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
const generateTreasures = (num, challMin, challMax, roomId) => {
  const genTreasures = [];

  for (let i = 0; i < num; i++) {
    genTreasures.push({ x: 0, y: 0, challenge: [] });
    genTreasures[i].x = getRandomInt(
      treasureDims.width / 2,
      // worldDims.width - treasureDims.width / 2,
      rooms[roomId].worldDims.width - treasureDims.width / 2,
    );
    genTreasures[i].y = getRandomInt(
      treasureDims.height / 2,
      // worldDims.height - treasureDims.height / 2,
      rooms[roomId].worldDims.height - treasureDims.width / 2,
    );
    genTreasures[i].challenge = createChallenge(challMin, challMax);
    genTreasures[i]._id = i;
  }

  return genTreasures;
};

// create new room object with new room id and generate the treasures for it
const createRoom = (name, maxRoomPlayers, minPlayers, time, numTreasures, hardOn, size) => {
  roomIds++;
  rooms[roomIds] = {
    name,
    maxPlayers: maxRoomPlayers,
    minPlayers,
    timerSeconds: time * 60,
    startTime: time,
    numTreasures,
    hard: hardOn,
    size,
    worldDims: {},
    _id: roomIds,
    roomJustMade: true,
    numPlayers: 0,
    roomPlayers: {},
    ended: false,
  };

  switch (size) {
    case 'small':
      rooms[roomIds].worldDims = { width: 600, height: 600 };
      break;

    case 'medium':
      rooms[roomIds].worldDims = { width: 1000, height: 1000 };
      break;

    case 'large':
      rooms[roomIds].worldDims = { width: 1600, height: 1600 };
      break;

    case 'huge':
      rooms[roomIds].worldDims = { width: 2400, height: 2400 };
      break;

    default:
      rooms[roomIds].worldDims = { width: 1000, height: 1000 };
      console.log('default occurred in createRoom, gameManager line 224');
      break;
  }

  rooms[roomIds].treasures = generateTreasures(
    rooms[roomIds].numTreasures,
    minChallengeLen,
    maxChallengeLen,
    roomIds,
  );
};

// get all current rooms with only information that the client needs
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
      ended: rooms[roomList[i]].ended,
      hard: rooms[roomList[i]].hard,
      size: rooms[roomList[i]].size,
      worldDims: rooms[roomList[i]].worldDims,
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
