const express = require("express");
const {
  addToCart,
  removeFromCart,
  removeMultipleFromCart,
  changeQtyFromCart,
  checkOut,
  getCartItems,
} = require("../controllers/cartController");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const { validate } = require("../utils/validator");

router.post("/add", auth, validate("addToCart"), addToCart);
router.delete("/remove", auth, removeFromCart);
router.delete("/remove-multiple", auth, removeMultipleFromCart);
router.patch("/changeQty", auth, validate("addToCart"), changeQtyFromCart);
router.get("/view", auth, getCartItems);
router.post("/checkout", auth, checkOut);

module.exports = router;
