const express = require("express");
const router = express.Router();
const { validate } = require("../utils/validator");
const { auth } = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/roleMiddleware");
const Role = require("../data/roles");
const {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoryController");

router
  .route("/")
  .post(auth, checkPermission(Role.Admin), validate("addCategory"), addCategory)
  .get(getCategories);
router
  .route("/:id")
  .delete(auth, checkPermission(Role.Admin), deleteCategory)
  .patch(
    auth,
    checkPermission(Role.Admin),
    validate("addCategory"),
    updateCategory
  );

module.exports = router;
