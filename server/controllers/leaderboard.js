const _ = require('underscore');
const models = require('../models');

const { Account } = models;

// renders leaderboard page
const boardPage = (req, res) => res.render('leaderboard');

// gets accounts sorted by wins and top threes
const getLeaderboard = async (req, res) => {
  try {
    const docs = await Account.find({ wins: { $gte: 0 } });

    const winsBoard = JSON.parse(JSON.stringify(docs));
    // _.sortBy(winsBoard, (acc) => acc.wins).reverse(); // why doesnt this work
    winsBoard.sort().reverse();

    const topThreesBoard = JSON.parse(JSON.stringify(docs));
    _.sortBy(topThreesBoard, (acc) => acc.topThrees).reverse();

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
