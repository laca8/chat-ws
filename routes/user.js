const express = require("express");
const { addUser, login, getUsers } = require("../controllers/user");
const { protect } = require("../middlwares/auth");

const router = express.Router();
router.post("/add", addUser);
router.post("/login", login);
router.get("/", getUsers);
module.exports = router;
