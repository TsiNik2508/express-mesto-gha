const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const HTTP_STATUS_CODE = require('../constans/constants');

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(HTTP_STATUS_CODE.OK).send({ data: users });
    })
    .catch(() => {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(HTTP_STATUS_CODE.OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ message: err.message });
        return;
      }
      res.status(HTTP_STATUS_CODE.SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          res.status(HTTP_STATUS_CODE.CREATED).send(user);
        })
        .catch((err) => {
          res.status(HTTP_STATUS_CODE.BAD_REQUEST).send(err);
        });
    })
    .catch(() => {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.status(HTTP_STATUS_CODE.OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ message: err.message });
        return;
      }
      res.status(HTTP_STATUS_CODE.SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((userAvatar) => {
      res.status(HTTP_STATUS_CODE.OK).send({ data: userAvatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ message: err.message });
        return;
      }
      res.status(HTTP_STATUS_CODE.SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(HTTP_STATUS_CODE.UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
        return;
      }

      bcrypt.compare(password, user.password)
        .then((isPasswordCorrect) => {
          if (!isPasswordCorrect) {
            res.status(HTTP_STATUS_CODE.UNAUTHORIZED).send({ message: 'Неправильные почта или пароль' });
            return;
          }

          const token = jwt.sign({ _id: user._id }, 'your-secret-key', { expiresIn: '7d' });

          res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          });

          res.status(HTTP_STATUS_CODE.OK).send({ message: 'Вход выполнен успешно' });
        })
        .catch(() => {
          res.status(HTTP_STATUS_CODE.SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
        });
    })
    .catch(() => {
      res.status(HTTP_STATUS_CODE.SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUserInfo = (req, res) => {
  res.status(HTTP_STATUS_CODE.OK).send({ data: req.user });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getUserInfo,
};
