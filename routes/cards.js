const cardRoute = require('express').Router();
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');
const {
  validateCard,
  validateCardById,
} = require('../middlewares/validate');

cardRoute.get('/', getAllCards);
cardRoute.post('/', validateCard, createCard);
cardRoute.delete('/:cardId', validateCardById, deleteCard);
cardRoute.put('/:cardId/likes', validateCardById, likeCard);
cardRoute.delete('/:cardId/likes', validateCardById, dislikeCard);

module.exports = cardRoute;
