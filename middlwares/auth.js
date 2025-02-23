const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const protect = async (req, res, next) => {
  let token;
  //check if token exist
  try {
    if (req.headers.authorization && req.headers.authorization) {
      token = req.headers.authorization;
    }
    if (!token) {
      return next(new AppError("please login...", 400));
    }
    //verify token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    //check if user exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return next(new AppError("user not found", 404));
    }
    req.user = currentUser;
    //console.log(req.user);
    next();
  } catch (err) {
    console.log(err);
    return next(new AppError(error.message, 500));
  }
};
const allowTo = async (req, res, next) => {
  if (!req.user.role == "admin") {
    return next(new AppError("user is not allow to access this route", 500));
  }
  next();
};
module.exports = {
  protect,
  allowTo,
};
