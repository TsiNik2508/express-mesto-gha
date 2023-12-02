const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: 'Internal Server Error' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid user ID' });
      }
      return res.status(500).send({ message: 'Internal Server Error' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Validation Error' });
      }
      return res.status(500).send({ message: 'Internal Server Error' });
    });
};
