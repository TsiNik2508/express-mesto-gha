const Card = require('../models/card');
const HTTP_STATUS_CODE = require('../constants/constants');

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(HTTP_STATUS_CODE.OK).send({ data: cards });
    })
    .catch(() => {
      res
        .status(HTTP_STATUS_CODE.SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(HTTP_STATUS_CODE.CREATED).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .send({ message: err.message });
        return;
      }
      res
        .status(HTTP_STATUS_CODE.SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(HTTP_STATUS_CODE.NOT_FOUND)
          .send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.status(HTTP_STATUS_CODE.OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .send({ message: err.message });
        return;
      }
      res
        .status(HTTP_STATUS_CODE.SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(HTTP_STATUS_CODE.NOT_FOUND)
          .send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.status(HTTP_STATUS_CODE.OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .send({ message: err.message });
        return;
      }
      res
        .status(HTTP_STATUS_CODE.SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        res
          .status(HTTP_STATUS_CODE.NOT_FOUND)
          .send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      if (card.owner.toString() !== req.user._id) {
        res
          .status(HTTP_STATUS_CODE.FORBIDDEN)
          .send({ message: 'Недостаточно прав для удаления карточки' });
        return;
      }
      Card.findByIdAndRemove(cardId)
        .then(() => {
          res.status(HTTP_STATUS_CODE.OK).send({ data: card });
        })
        .catch((err) => {
          res
            .status(HTTP_STATUS_CODE.SERVER_ERROR)
            .send({ message: 'На сервере произошла ошибка' });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .send({ message: 'Некорректный формат идентификатора карточки' });
        return;
      }
      res
        .status(HTTP_STATUS_CODE.SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
  Card,
};
