require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const dbURI = process.env.DB_URL || 'mongodb://localhost:27017/mestodb';

mongoose.connect(dbURI, { useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB is connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '656f53bf3cbcda266185890f',
  };

  next();
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
