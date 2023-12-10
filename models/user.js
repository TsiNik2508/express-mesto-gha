const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validateUrl = require('validator/lib/isURL');
const validateEmail = require('validator/lib/isEmail');
const Unauthorized = require('../error/Unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://cdn.forbes.ru/forbes-static/c/908x511/new/2022/05/rick-and-morty-siemki-3-62851a0fad390.webp',
    validate: {
      validator: validateUrl,
      message: 'Некорректный адрес URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validateEmail,
      message: 'Некорректный адрес почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Пользователь с таким адресом почты не найден'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized('Неправильный пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('User', userSchema);
