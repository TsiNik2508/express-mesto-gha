const express = require('express');
const mongoose = require('mongoose');
const http2 = require('http2');
const routes = require('./routes');

const app = express();

app.use(express.json());

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '656f53bf3cbcda266185890f',
  };

  next();
});

app.use(routes);

app.use('*', (req, res) => {
  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Неверный путь' });
});

app.listen(PORT);