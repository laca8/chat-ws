const express = require("express");
const { fetchMembers } = require("../controllers/groupMembers");
const { protect } = require("../middlwares/auth");
const router = express.Router();

router.get("/:name", protect, fetchMembers);
module.exports = router;
