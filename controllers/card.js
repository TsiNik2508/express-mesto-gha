const cardSchema = require('../models/card');
const Status = require('../error/Status');
const BadRequest = require('../error/BadRequest');
const Forbidden = require('../error/Forbidden');

module.exports.getAllCards = (req, res, next) => {
  cardSchema
    .find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.createCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardSchema
    .create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('На сервере произошла ошибка'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new Status('Запрашиваемая карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  cardSchema
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new Status('Запрашиваемая карточка не найдена');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return cardSchema.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new Status('Запрашиваемая карточка не найдена');
      }
      if (!card.owner.equals(req.user._id)) {
        return next(new Forbidden('Недостаточно прав для удаления карточки'));
      }
      return card.remove().then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
};
