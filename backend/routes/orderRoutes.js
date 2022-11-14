const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const { validate } = require("../utils/validator");



module.exports = router;