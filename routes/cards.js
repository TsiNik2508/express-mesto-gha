const cardRoute = require('express').Router();
const {
  getAllCards,
  createCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');
const {
  validateCreateCard,
  validateCardById,
} = require('../middlewares/validate');

cardRoute.get('/', getAllCards);
cardRoute.post('/', validateCreateCard, createCards);
cardRoute.delete('/:cardId', validateCardById, deleteCard);
cardRoute.put('/:cardId/likes', validateCardById, likeCard);
cardRoute.delete('/:cardId/likes', validateCardById, dislikeCard);

module.exports = cardRoute;
