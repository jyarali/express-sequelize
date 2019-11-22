const { Sequelize } = require("sequelize");
const sequelize = require("../utils/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

User.prototype.isValidPassword = async function(password) {
  const user = this;
  //Hashes the password sent by the user for login and checks if the hashed password stored in the
  //database matches the one sent. Returns true if it does else false.
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

// remove password from response
User.prototype.toJSON = function() {
  var values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

// hash password before creating a user
User.beforeCreate(async function(user) {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});
// hash password before updating a user
User.beforeUpdate(async function(user) {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

module.exports = User;
