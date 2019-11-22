// express base
const express = require("express");
// require dotenv and initialize config
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
// setup db connection using sequelize
const sequelize = require("./utils/database");
// require authentication
require("./auth/auth");
// import api routes
const users = require("./routes/user");
const todos = require("./routes/todo");
// import models
const User = require("./models/User");
const Todo = require("./models/Todo");
// initialize express
const app = express();
// initialize body parser
app.use(express.json());
// setup api routes
app.use("/api/user", users);
app.use("/api/todos", todos);
//Handle 404 error
app.use(function(req, res, next) {
  res.status(404);
  res.json({ error: "Not Found!" });
});
app.use(function(err, req, res, next) {
  res.status(500);
  res.json({ err });
});
// define app default port
const PORT = process.env.PORT || 3000;
// setup models relationship
Todo.belongsTo(User);
User.hasMany(Todo);
// setup databse and run app after it
sequelize
  .sync({})
  .then(result => {
    app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));
