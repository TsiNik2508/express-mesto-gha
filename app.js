const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(DB_URL).then(() => {
  console.log('MongoDB is connected');
});

app.use(bodyParser.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(helmet());

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Неверный путь' });
});

app.listen(PORT, () => {
  console.log('Server is connected');
});
