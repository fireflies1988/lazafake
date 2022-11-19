const express = require("express");
const {
  addToCart,
  removeFromCart,
  removeMultipleFromCart,
  changeQtyFromCart,
  viewCart,
  checkOut,
} = require("../controllers/cartController");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const { validate } = require("../utils/validator");

router.post("/add", auth, addToCart);
router.delete("/remove", auth, removeFromCart);
router.delete("/remove-multiple", auth, removeMultipleFromCart);
router.patch("/changeQty", auth, changeQtyFromCart);
router.get("/view", auth, viewCart);
router.post("/checkout", auth, checkOut);

module.exports = router;
