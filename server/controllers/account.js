const models = require('../models');

const { Account, ShopItem } = models;

// render account page
const accountPage = (req, res) => res.render('account');

// render login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// render home page
const homePage = (req, res) => {
  res.render('home');
};

// log out logged in user
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// check if username and password match user and log user in
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'all fields required' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'wrong username or password' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/account' });
  });
};

// check if username is already in use and if passwords match
// add new user to database and log user in
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'all fields are required' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'passwords do not match' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/account' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'username already in use' });
    }

    return res.status(400).json({ error: 'an error occurred' });
  }
};

// set equipped skin of user
const equipSkin = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'error: skin name required' });
  }

  try {
    const changedAccount = await Account.findOne({ username: req.session.account.username });
    changedAccount.equippedSkin = req.body.name;
    await changedAccount.save();
    req.session.account = Account.toAPI(changedAccount);
    return res.status(201).json({ account: req.session.account });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'an error occurred' });
  }
};

// add a shop item to the user's account
const addItemToAccount = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'item name required' });
  }

  try {
    const item = await ShopItem.findOne({ name: req.body.name });
    const changedAccount = await Account.findOne({ username: req.session.account.username });
    changedAccount.skins.push(item);
    await changedAccount.save();
    req.session.account = Account.toAPI(changedAccount);
    return res.status(201).json({ account: req.session.account });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'an error occurred' });
  }
};

// check if current password matches user's password and if new passwords match
// change user's password to new password
const changePassword = async (req, res) => {
  const currPass = `${req.body.currPass}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;

  if (!currPass || !newPass || !newPass2) {
    return res.status(400).json({ error: 'all fields are required' });
  }

  let wrongPass = false;
  await Account.authenticate(req.session.account.username, currPass, (err, account) => {
    wrongPass = err || !account;
  });

  console.log(wrongPass);
  if (wrongPass) {
    return res.status(401).json({ error: 'current password is wrong' });
  }

  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'new passwords do not match' });
  }

  try {
    const hash = await Account.generateHash(newPass);
    const changedAccount = await Account.findOne({ username: req.session.account.username });
    changedAccount.password = hash;
    await changedAccount.save();
    req.session.account = Account.toAPI(changedAccount);
    return res.json({ redirect: '/account' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'an error occurred' });
  }
};

// get user's account info that client needs
const getAccountInfo = async (req, res) => {
  try {
    const accountInfo = await Account.findOne({ username: req.session.account.username });
    return res.json({
      account: {
        username: accountInfo.username,
        gamesPlayed: accountInfo.gamesPlayed,
        wins: accountInfo.wins,
        _id: accountInfo._id,
        skins: accountInfo.skins,
        equippedSkin: accountInfo.equippedSkin,
        topThrees: accountInfo.topThrees,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'an error occurred' });
  }
};

// get token
const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });

module.exports = {
  accountPage,
  loginPage,
  login,
  logout,
  signup,
  getToken,
  getAccountInfo,
  equipSkin,
  addItemToAccount,
  changePassword,
  homePage,
};
