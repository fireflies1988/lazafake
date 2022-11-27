const express = require("express");
const {
  addAddress,
  deleteAddress,
  updateAddress,
  getAddresses,
  getAddressById,
} = require("../controllers/addressController");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const { validate } = require("../utils/validator");
const Role = require("../data/roles");
const checkPermission = require("../middlewares/roleMiddleware");

router.route("/").post(auth, validate("addAddress"), addAddress)
    .get(auth, getAddresses);
router
  .route("/:id")
  .delete(auth, deleteAddress)
  .patch(auth, validate("updateAddress"), updateAddress);
router.get("/:id", auth, getAddressById);

module.exports = router;
