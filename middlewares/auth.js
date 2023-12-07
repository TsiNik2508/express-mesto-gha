const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ message: 'Необходима авторизация' });
    }

    req.user = payload;
    next();
  });
};

module.exports = authMiddleware;
