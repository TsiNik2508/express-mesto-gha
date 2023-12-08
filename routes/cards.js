const router = require('express').Router();
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');
const {
  validateCard,
  errors: validateErrors,
} = require('../middlewares/validate');

router.get('/', getAllCards);
router.post('/', validateCard, createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

router.use(validateErrors());

module.exports = router;
