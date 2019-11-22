const { Sequelize } = require("sequelize");
const sequelize = require("../utils/database");

const Todo = sequelize.define("todo", {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  done: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Todo;
