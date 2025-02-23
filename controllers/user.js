const User = require("../models/User");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const createToken = (payload) => {
  return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.EXPIRE_TIME,
  });
};
const addUser = async (req, res, next) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return next(new AppError("user already exist..", 404));
    }
    const user = await User.create({
      email: req.body.email,
      username: req.body.username,
    });

    const token = createToken(user._id);
    res.status(201).json({ user, token });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
const login = async (req, res, next) => {
  try {
    console.log(req.body);
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("user not found..", 404));
    }
    const token = createToken(user._id);
    res.status(201).json({ user, token });
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message, 500));
  }
};
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message, 500));
  }
};
module.exports = {
  addUser,
  login,
  getUsers,
};
