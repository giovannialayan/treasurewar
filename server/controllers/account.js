const models = require('../models');

const { Account, ShopItem } = models;

const accountPage = (req, res) => res.render('account');

const loginPage = (req, res) => {
  res.render('home', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

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

const equipSkin = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'skin name required' });
  }

  try {
    const changedAccount = await Account.find({ username: req.session.username });
    changedAccount.equippedSkin = req.body.name;
    await changedAccount.save();
    req.session.account = Account.toAPI(changedAccount);
    return res.status(201).json({ account: req.session.account });
  } catch (err) {
    return res.status(400).json({ error: 'an error occurred' });
  }
};

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

const changePassword = async (req, res) => {
  const currPass = `${req.body.currPass}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;

  if (!currPass || !newPass || !newPass2) {
    return res.status(400).json({ error: 'all fields are required' });
  }

  let wrongPass = false;
  Account.authenticate(req.session.username, currPass, (err, account) => {
    wrongPass = err || !account;
  });
  
  if(wrongPass) {
    return res.status(401).json({error: 'current password is wrong'});
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

const getAccountInfo = async (req, res) => {
  try{
    const accountInfo = await Account.findOne({ username: req.session.account.username });
    return res.json({ 
      account: {
        username: accountInfo.username, 
        gamesPlayed: accountInfo.gamesPlayed, 
        wins: accountInfo.wins, 
        _id: accountInfo._id, 
        skins: accountInfo.skins, 
        equippedSkin: accountInfo.equippedSkin,
        topThrees: accountInfo.topThrees
      }
    });
  }
  catch(err) {
    console.log(err);
    return res.status(400).json({ error: 'an error occurred' });
  }
};

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
};
