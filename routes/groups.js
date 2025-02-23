const express = require("express");
const { fetchGroups } = require("../controllers/groups");
const { protect } = require("../middlwares/auth");
const router = express.Router();

router.get("/", protect, fetchGroups);
module.exports = router;
