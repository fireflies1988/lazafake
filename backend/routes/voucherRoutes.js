const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const { validate } = require("../utils/validator");
const checkPermission = require("../middlewares/roleMiddleware");
const Role = require("../data/roles");
const {
  createVoucher,
  deleteVoucher,
  getVouchers,
} = require("../controllers/voucherController");

router
  .route("/")
  .post(
    auth,
    checkPermission([Role.Admin, Role.SpAdmin]),
    validate("createVoucher"),
    createVoucher
  )
  .get(auth, checkPermission([Role.Admin, Role.SpAdmin]), getVouchers);
router.delete("/:id", auth, checkPermission([Role.Admin, Role.SpAdmin]), deleteVoucher);

module.exports = router;
