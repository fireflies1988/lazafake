const express = require("express");
const router = express.Router();
const checkPermission = require("../middlewares/roleMiddleware");
const Role = require("../data/roles");
const { auth } = require("../middlewares/authMiddleware");
const { sendVerificationCode } = require("../controllers/mailController");


module.exports = router;
