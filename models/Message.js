const mongoose = require("mongoose");
// models/message.js
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
    },
    group_name: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("message", messageSchema);
