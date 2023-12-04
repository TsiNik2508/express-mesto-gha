const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const { PORT = 3000, DB_URL = "mongodb://127.0.0.1:27017/mestodb" } =
  process.env;
const app = express();

mongoose.connect(DB_URL).then(() => {
  console.log("MongoDB is connected");
});
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: "47368917b2g768vf4fd2d502",
  };

  next();
});
app.use(helmet());
app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));
app.listen(PORT, () => {
  console.log("Server is connected");
});
