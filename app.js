require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const http2 = require('http2');
const authMiddleware = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

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
app.use('/users', authMiddleware);
app.use('/users', require('./routes/users'));

app.use('/cards', authMiddleware);
app.use('/cards', require('./routes/cards'));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Ошибка соединения с MongoDB:'));
db.once('open', () => {
  console.log('Соединение с MongoDB установлено');
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});

app.use((req, res) => {
  const error = new Error('Not Found');
  error.status = http2.constants.HTTP_STATUS_NOT_FOUND;
  error.message = 'Endpoint not found';

  res.status(http2.constants.HTTP_STATUS_NOT_FOUND).json({ message: 'Неверный путь' });
});

app.use(errorHandler);
