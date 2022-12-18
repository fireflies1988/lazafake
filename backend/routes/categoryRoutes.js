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
const upload = require("../configs/multer");

router
  .route("/")
  .post(
    auth,
    checkPermission([Role.Admin, Role.SpAdmin]),
    upload.single("thumbnail"),
    validate("addCategory"),
    addCategory
  )
  .get(getCategories);

router
  .route("/:id")
  .delete(auth, checkPermission([Role.Admin, Role.SpAdmin]), deleteCategory)
  .patch(
    auth,
    checkPermission([Role.Admin, Role.SpAdmin]),
    upload.single("thumbnail"),
    validate("addCategory"),
    updateCategory
  );

module.exports = router;
