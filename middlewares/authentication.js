const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.get('token');
  jwt.verify(token, process.env.TOKEN_SEED, (error, decoded) => {
    if (error) return res.status(401).json({ success: false, message: error.message });
    req.user = decoded.user;
    next();
  });
};

module.exports = { verifyToken };