const User = require("../models/User");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
// require dotenv and initialize config
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

exports.createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: errors.array().map(item => item.msg) });
  }
  const { name, username, password } = req.body;
  try {
    const user = await User.create({
      name,
      username,
      password
    });
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false
    });
  }
};

exports.login = async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An Error occured");
        return next(error);
      }
      req.login(user, { session: false }, async error => {
        if (error) return next(error);
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the username and id
        const body = { id: user.id, username: user.username };
        //Sign the JWT token and populate the payload with the user username and id
        const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE
        });
        //Send back the token to the user
        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

exports.profile = async (req, res, next) => {
  try {
    // const user = await User.findByPk(req.user.id);
    // res.status(200).json(user);
    res.json(req.user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false
    });
  }
};

exports.updateProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ errors: errors.array().map(item => item.msg) });
  }
  try {
    let user = await User.findByPk(req.user.id);
    const { name, username, password } = req.body;
    const updatedUser = await user.update({
      name,
      username,
      password
    });
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
