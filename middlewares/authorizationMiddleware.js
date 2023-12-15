const { ROLES } = require('../utils/constants');

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === ROLES.ADMIN) {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
};

module.exports = authorizeAdmin;
