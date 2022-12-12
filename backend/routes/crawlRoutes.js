const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/roleMiddleware");
const Role = require("../data/roles");
const { crawlTikiProductAsync } = require("../controllers/crawlController");
const { validate } = require("../utils/validator");

router.post(
  "/tiki",
  auth,
  checkPermission(Role.Admin),
  validate("crawlTikiProduct"),
  crawlTikiProductAsync
);

module.exports = router;
