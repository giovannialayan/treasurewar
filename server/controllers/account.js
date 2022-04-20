const models = require('../models');

const { Account } = models;

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
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'username already in use' });
    }

    return res.status(400).json({ error: 'an error occurred' });
  }
};

const equipSkin = (req, res) => {
  if(!req.body.name) {
    return res.status(400).json({ error: 'skin name required' });
  }

  //https://mongoosejs.com/docs/tutorials/findoneandupdate.html
  //let doc = await account.findOneAndUpdate({ name: req.session.account._id }, {});
};

const getAccountInfo = (req, res) => res.json({ account: req.session.account });

const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });

module.exports = {
  accountPage,
  loginPage,
  login,
  logout,
  signup,
  getToken,
  getAccountInfo,
};
