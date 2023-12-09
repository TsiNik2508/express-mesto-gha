const HTTP_STATUS_CODE = require('../constans/constants');

const errorHandler = (err, req, res) => {
  let statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
  let message = 'На сервере произошла ошибка';

  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
    message = err.message;
  } else if (err.name === 'MongoError' && err.code === 11000) {
    statusCode = HTTP_STATUS_CODE.CONFLICT;
    message = 'Пользователь с таким email уже зарегистрирован';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
    message = 'Некорректный токен';
  }

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
