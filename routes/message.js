const express = require("express");
const {
  fetchGroupMessages,

  deleteMessage,
  fetchPrivateMessages,
} = require("../controllers/message");
const { protect } = require("../middlwares/auth");
const router = express.Router();

router.get("/private/:username", protect, fetchPrivateMessages);
router.get("/group/:groupName", protect, fetchGroupMessages);
router.delete("/:id", protect, deleteMessage);
module.exports = router;
