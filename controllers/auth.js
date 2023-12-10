const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userSchema = require('../models/user');
const BadRequest = require('../error/BadRequest');
const Conflict = require('../error/Conflict');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    userSchema
      .create({
        name, about, avatar, email, password: hash,
      })
      .then(() => res.status(201).send(
        {
          data: {
            name, about, avatar, email,
          },
        },
      ))
      .catch((err) => {
        if (err.code === 11000) {
          return next(new Conflict('Ошибка при создании пользователя'));
        }
        if (err.name === 'ValidationError') {
          return next(new BadRequest('На сервере произошла ошибка'));
        }
        return next(err);
      });
  })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return userSchema
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'your-secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};
