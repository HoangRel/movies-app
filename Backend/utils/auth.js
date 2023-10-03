const UserToken = require('../models/UserToken');

// Xét token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userTokens = UserToken.all();

  const tokenValue = token.split(' ')[1];

  const user = userTokens.find(user => user.token === tokenValue);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};

module.exports = authenticate;
