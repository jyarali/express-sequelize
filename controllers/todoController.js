const Todo = require("../models/Todo");
const User = require("../models/User");
const passport = require("passport");
const { check, validationResult } = require("express-validator");

exports.index = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const todos = await user.getTodos({
      include: [
        {
          model: User,
          attributes: ["id", "name", "username"]
        }
      ]
    });

    res.status(200).json(todos);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.show = async (req, res, next) => {
  try {
    const id = req.params.Id;
    const todo = await Todo.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "name", "username"]
        }
      ]
    });
    if (!todo) {
      return res
        .status(404)
        .json({ error: "Resource you are looking for, Not Found!" });
    }
    if (todo.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to do this action!" });
    }
    res.status(200).json(todo);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, description, done } = req.body;
    const user = await User.findByPk(req.user.id);
    const newTodo = await user.createTodo({
      title,
      description,
      done
    });
    res.status(201).json(newTodo);
  } catch (err) {
    console.log(err);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const id = req.params.Id;
    const { title, description, done } = req.body;
    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res
        .status(404)
        .json({ error: "Resource you are looking for, Not Found!" });
    }
    if (todo.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to do this action!" });
    }
    const updatedtodo = await todo.update({ title, description, done });
    res.status(200).json(updatedtodo);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const id = req.params.Id;
    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res
        .status(404)
        .json({ error: "Resource you are looking for, Not Found!" });
    }
    if (todo.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to do this action!" });
    }
    const rtodo = await todo.destroy();
    res.status(200).json({ msg: "Todo Removed successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
