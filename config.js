require('dotenv').config();
const config = {
  DB_URL: 'mongodb://127.0.0.1:27017/mestodb',
  mongoURI: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
};
module.exports = config;
