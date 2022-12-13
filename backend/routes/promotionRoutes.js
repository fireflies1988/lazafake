const express = require("express");
const router = express.Router();
const { validate } = require("../utils/validator");
const { auth } = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/roleMiddleware");
const Role = require("../data/roles");
const {
  addPromotion,
  getPromotions,
  deletePromotion,
  editPromotion,
} = require("../controllers/promotionController");

router.post(
  "/",
  auth,
  checkPermission(Role.Admin),
  validate("addPromotion"),
  addPromotion
);

router.get("/", auth, checkPermission(Role.Admin), getPromotions);
router.delete("/:id", auth, checkPermission(Role.Admin), deletePromotion);
router.put(
  "/:id",
  auth,
  checkPermission(Role.Admin),
  validate("addPromotion"),
  editPromotion
);

module.exports = router;
