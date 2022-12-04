const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  refreshToken,
  updateMe,
  changePassword,
  viewMyVouchers,
  viewMyOrders,
  cancelOrder,
  getMyNotifications,
  getUsers,
} = require("../controllers/userController");
const { auth } = require("../middlewares/authMiddleware");
const { validate } = require("../utils/validator");
const upload = require("../configs/multer");
const checkPermission = require("../middlewares/roleMiddleware");
const Role = require("../data/roles");

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
router.get("/me/orders", auth, viewMyOrders);
router.patch("/me/orders/:id", auth, cancelOrder);
router.get("/me/notifications", auth, getMyNotifications);
router.get("/", auth, checkPermission(Role.Admin), getUsers);

module.exports = router;
