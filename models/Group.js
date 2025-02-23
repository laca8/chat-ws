// models/conversation.js
const mongoose = require("mongoose");

// Conversation Schema
const groupSchema = new mongoose.Schema(
  {
    group_name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("group", groupSchema);
