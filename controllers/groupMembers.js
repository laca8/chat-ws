const GroupMember = require("../models/GroupMember");
const AppError = require("../utils/AppError");
const fetchMembers = async (req, res, next) => {
  try {
    const members = await GroupMember.find({ group_name: req.params.name });
    res.status(200).json(members);
  } catch (error) {
    console.log(error);
    next(new AppError(error.message, 500));
  }
};
module.exports = {
  fetchMembers,
};
