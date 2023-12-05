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
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(HTTP_STATUS_CODE.CREATED).send(user);
    })
    .catch((err) => {
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).send(err);
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

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  User,
};
