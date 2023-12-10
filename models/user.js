const mongoose = require('mongoose');
const validator = require('validator');
const Unauthorized = require('../error/Unauthorized');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Invalid email address',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        const urlPattern = /^(https?:\/\/)?(www\.)?([-a-zA-Z0-9_.]{2,}\.\w{2,})(\/[-a-zA-Z0-9_./?&=#]*)?$/;
        return urlPattern.test(v);
      },
      message: 'Некорректный URL аватара',
    },
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized('Неправильная почта или пароль'));
          }
          return user;
        });
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
