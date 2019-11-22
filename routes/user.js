const express = require("express");
const users = express.Router();
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const userController = require("../controllers/userController");

users.get("/", (req, res, next) => {
  res.json({
    success: true
  });
});

users.post(
  "/register",
  [
    check("username")
      .isLength({ min: 3 })
      .withMessage("نام کاربری باید حداقل 3 کاراکتر باشد"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("کلمه عبور باید حداقل 6 کاراکتر باشد")
  ],
  userController.createUser
);

users.post("/login", userController.login);

users.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.profile
);

users.put(
  "/profile",
  [
    check("username")
      .optional()
      .isLength({ min: 3 })
      .withMessage("نام کاربری باید حداقل 3 کاراکتر باشد"),
    check("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("کلمه عبور باید حداقل 6 کاراکتر باشد")
  ],
  passport.authenticate("jwt", { session: false }),
  userController.updateProfile
);

module.exports = users;
