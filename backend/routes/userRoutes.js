const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  refreshToken,
  updateMe,
  changePassword,
  addToCart,
  removeFromCart,
  removeMultipleFromCart,
  changeQtyFromCart,
  viewCart,
  viewMyVouchers,
  useVoucher,
} = require("../controllers/userController");
const { auth } = require("../middlewares/authMiddleware");
const { validate } = require("../utils/validator");
const upload = require("../configs/multer");

router.post("/", validate("register"), register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router
  .route("/me")
  .get(auth, getMe)
  .patch(auth, upload.single("avatar"), validate("updateMe"), updateMe);
router.patch(
  "/me/password/change",
  auth,
  validate("changePassword"),
  changePassword
);
router.get("/me/vouchers", auth, viewMyVouchers);
router.patch("/me/vouchers/:id", auth, useVoucher);

module.exports = router;
