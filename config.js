require('dotenv').config();

const config = {
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/mestodb',
  mongoURI: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
};

module.exports = config;
