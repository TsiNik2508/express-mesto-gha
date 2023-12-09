const jwt = require('jsonwebtoken');

const createUnauthorizedError = (message) => {
  const error = new Error(message);
  error.statusCode = 401;
  return error;
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(createUnauthorizedError('Необходима авторизация'));
    return;
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'your-secret-key');
  } catch (err) {
    next(createUnauthorizedError('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};
