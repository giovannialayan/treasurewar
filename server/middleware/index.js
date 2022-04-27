const admins = ['gio'];

const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/account');
  }
  return next();
};

const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

// only go through if the user is logged in and logged in to an admin account
const requiresAdmin = (req, res, next) => {
  if (!req.session.account) {
    return res.status(400).json({ error: 'logging into an admin account is required for this request' });
  }
  if (!admins.includes(req.session.account.username)) {
    return res.status(400).json({ error: 'an admin account is required for this request' });
  }

  return next();
};

const bypassSecure = (req, res, next) => {
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;
module.exports.requiresAdmin = requiresAdmin;

if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
