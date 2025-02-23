// models/conversation.js
const mongoose = require("mongoose");

// Conversation Schema
const groupMemberSchema = new mongoose.Schema(
  {
    group_name: {
      type: String,
      required: true,
    },
    username: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("groupMember", groupMemberSchema);
