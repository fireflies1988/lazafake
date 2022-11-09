const express = require("express");
const router = express.Router();
const { validate } = require("../utils/validator");
const { auth } = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/roleMiddleware");
const Role = require("../data/roles");
const {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  removeProductImage,
  addProductImage,
} = require("../controllers/productController");
const upload = require("../configs/multer");

router
  .route("/")
  .post(
    auth,
    checkPermission(Role.Admin),
    upload.array("images"),
    validate("addProduct"),
    addProduct
  )
  .get(getProducts);

router
  .route("/:id")
  .delete(auth, checkPermission(Role.Admin), deleteProduct)
  .patch(
    auth,
    checkPermission(Role.Admin),
    validate("updateProduct"),
    updateProduct
  );

router.delete(
  "/:productId/images/:imageId",
  auth,
  checkPermission(Role.Admin),
  removeProductImage
);

router.post(
  "/:id/images",
  auth,
  checkPermission(Role.Admin),
  upload.single("image"),
  addProductImage
);

module.exports = router;
