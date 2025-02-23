const Group = require("../models/Group");
const AppError = require("../utils/AppError");
const fetchGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({});
    res.status(200).json(groups);
  } catch (error) {
    console.log(error);
    next(new AppError(error.message, 500));
  }
};
module.exports = {
  fetchGroups,
};
