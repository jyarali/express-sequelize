const express = require("express");
const todos = express.Router();
const passport = require("passport");
const { check, validationResult } = require("express-validator");
const todoController = require("../controllers/todoController");

todos.use(passport.authenticate("jwt", { session: false }));

todos.get("/", todoController.index);
todos.get("/:Id", todoController.show);
todos.post("/new", todoController.create);
todos.put("/:Id", todoController.edit);
todos.delete("/:Id", todoController.delete);

module.exports = todos;
