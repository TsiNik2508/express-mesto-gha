const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const router = require('./routes/route');

const app = express();

app.use(bodyParser.json());
const { validateSignup, validateSignin } = require('./middlewares/validate');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const { createUser, login } = require('./controllers/auth');

app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);
app.use(auth);
app.use(router);
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
async function connect() {
  try {
    await mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://localhost:27017/mestodb');
    console.log(`App connected ${MONGO_URL}`);
    await app.listen(PORT);
    console.log(`App listening on port ${PORT}`);
  } catch (err) {
    console.error(err);
  }
}
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

connect();
