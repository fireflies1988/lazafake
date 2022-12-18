const express = require("express");
const router = express.Router();
const { validate } = require("../utils/validator");
const { auth } = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/roleMiddleware");
const Role = require("../data/roles");
const { addReceipt, getReceipts } = require("../controllers/receiptController");

router.post(
  "/",
  auth,
  checkPermission([Role.Admin, Role.SpAdmin]),
  validate("addReceipt"),
  addReceipt
);
router.get("/", auth, checkPermission([Role.Admin, Role.SpAdmin]), getReceipts);

module.exports = router;
