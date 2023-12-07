const express = require('express');
const mongoose = require('mongoose');
const http2 = require('http2');

const app = express();
const port = process.env.PORT || 3000;

const dbURI = process.env.DB_URL || 'mongodb://localhost:27017/mestodb';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Соединение с MongoDB установлено');
  })
  .catch((error) => {
    console.error('Ошибка соединения с MongoDB:', error);
    process.exit(1);
  });

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '656f53bf3cbcda266185890f',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Ошибка соединения с MongoDB:'));
db.once('open', () => {
  console.log('Соединение с MongoDB установлено');
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  error.message = 'Endpoint not found';
  next(error);
});

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  error.message = 'Endpoint not found';

  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).json({ message: 'Неверный путь' });
});
