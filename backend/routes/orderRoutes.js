const express = require("express");
const {
  placeOrder,
  confirmPayment,
  cancelPayment,
  updateOrderStatus,
  viewOrders,
} = require("../controllers/orderController");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const { validate } = require("../utils/validator");
const checkPermission = require("../middlewares/roleMiddleware");
const Role = require("../data/roles");

router.post("/", auth, validate("placeOrder"), placeOrder);
router.get("/", auth, checkPermission(Role.Admin), viewOrders);
router.get("/confirm", confirmPayment);
router.get("/cancel", cancelPayment);
router.patch("/:id", auth, checkPermission(Role.Admin), updateOrderStatus);

module.exports = router;