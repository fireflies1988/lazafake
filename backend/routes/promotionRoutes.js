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
  checkPermission([Role.Admin, Role.SpAdmin]),
  validate("addPromotion"),
  addPromotion
);

router.get("/", auth, checkPermission([Role.Admin, Role.SpAdmin]), getPromotions);
router.delete("/:id", auth, checkPermission([Role.Admin, Role.SpAdmin]), deletePromotion);
router.put(
  "/:id",
  auth,
  checkPermission([Role.Admin, Role.SpAdmin]),
  validate("addPromotion"),
  editPromotion
);

module.exports = router;
