const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');
const BadRequest = require('../error/BadRequest');

const validateUrl = (url) => {
  if (isURL(url)) {
    return url;
  }
  throw new BadRequest('Некорректный адрес URL');
};

module.exports.validateSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.validateAvatarUpdate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateUrl),
  }),
});

module.exports.validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom(validateUrl),
  }),
});

const validateID = (id) => {
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    return id;
  }
  throw new BadRequest('Передан неклрретный id');
};

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom(validateID),
  }),
});

module.exports.validateCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(validateID),
  }),
});
