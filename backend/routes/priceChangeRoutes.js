const express = require("express");
const router = express.Router();
const { validate } = require("../utils/validator");
const { auth } = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/roleMiddleware");
const Role = require("../data/roles");
const { getPriceChanges } = require("../controllers/priceChangeController");

router.get("/", auth, checkPermission([Role.Admin, Role.SpAdmin]), getPriceChanges);

module.exports = router;
