const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const dbConnect = async (req, res) => {
  try {
    await mongoose.connect(process.env.dbURL);
    console.log("db connect");
  } catch (error) {
    console.log(error);
    process.exit(1);
    return next(new AppError(error.message, 404));
  }
};
module.exports = dbConnect;
