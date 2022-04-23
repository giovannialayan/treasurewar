const models = require('../models');

const { Account } = models;

// renders leaderboard page
const boardPage = (req, res) => res.render('leaderboard');

// gets accounts sorted by wins and top threes
const getLeaderboard = async (req, res) => {
  try {
    const docs = await Account.find({ wins: { $gte: 0 } });

    const winsBoard = JSON.parse(JSON.stringify(docs));
    winsBoard.sort((acc1, acc2) => acc2.wins - acc1.wins);

    const topThreesBoard = JSON.parse(JSON.stringify(docs));
    topThreesBoard.sort((acc1, acc2) => acc2.wins - acc1.wins);

    return res.status(200).json({ winsBoard, topThreesBoard });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'an error occurred' });
  }
};

module.exports = {
  boardPage,
  getLeaderboard,
};
