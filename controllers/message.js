const Message = require("../models/Message");
const AppError = require("../utils/AppError");
const fetchPrivateMessages = async (req, res, next) => {
  const { username } = req.params;
  try {
    console.log(req.user.username, username);

    const messages = await Message.find({
      $and: [
        {
          $or: [{ sender: req.user.username }, { receiver: req.user.username }],
        },
        { $or: [{ sender: username }, { receiver: username }] },
      ],
    })
      .sort({ date: 1 })
      .limit(20);

    // Update is_read status for messages where user is the receiver
    await Message.updateMany(
      {
        receiver: req.user.username,
        is_read: false,
      },
      {
        $set: { is_read: true },
      }
    );
    return res.status(201).json(messages);
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
const fetchGroupMessages = async (req, res, next) => {
  const { groupName } = req.params;

  try {
    const messages = await Message.find({
      group_name: groupName,
    })
      .sort({ date: 1 })
      .limit(20);

    // Update is_read status for messages where user is the receiver
    await Message.updateMany(
      {
        group_name: groupName,
        is_read: false,
      },
      {
        $set: { is_read: true },
      }
    );
    return res.status(201).json(messages);
  } catch (error) {
    console.log(error);

    return next(new AppError(error.message, 500));
  }
};
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(
      { _id: req.params.messageId },
      { deleted: true },
      { new: true }
    );
    return res.status(200).json("message deleted...");
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
module.exports = {
  fetchGroupMessages,
  fetchPrivateMessages,
  deleteMessage,
};
