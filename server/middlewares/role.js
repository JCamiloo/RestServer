const jwt = require('jsonwebtoken');

const verifyRole = (req, res, next) => {
  const token = req.get('token');
  jwt.verify(token, process.env.TOKEN_SEED, (error, decoded) => {
    if (error) return res.status(401).json({ success: false, message: error.message });
    if (decoded.user.role !== 'ADMIN_ROLE') return res.status(401).json({ success: false, message: 'Access denied'});
    next();
  });
};

module.exports = { verifyRole };