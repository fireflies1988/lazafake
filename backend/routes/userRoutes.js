const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  refreshToken,
  updateMe,
  changePassword,
  addAddress,
  deleteAddress,
  updateAddress,
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
router.post("/me/addresses", auth, validate("addAddress"), addAddress);
router
  .route("/me/addresses/:id")
  .delete(auth, deleteAddress)
  .patch(auth, validate("updateAddress"), updateAddress);

module.exports = router;
