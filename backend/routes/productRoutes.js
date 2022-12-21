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
  listProduct,
  changeProductPrice,
  getBrands,
} = require("../controllers/productController");
const upload = require("../configs/multer");

router
  .route("/")
  .post(
    auth,
    checkPermission([Role.Admin, Role.SpAdmin]),
    upload.array("images"),
    validate("addProduct"),
    addProduct
  )
  .get(getProducts);
router
  .route("/:id")
  .delete(auth, checkPermission([Role.Admin, Role.SpAdmin]), deleteProduct)
  .patch(
    auth,
    checkPermission([Role.Admin, Role.SpAdmin]),
    upload.array("images"),
    validate("updateProduct"),
    updateProduct
  );

router.delete(
  "/:productId/images/:imageId",
  auth,
  checkPermission([Role.Admin, Role.SpAdmin]),
  removeProductImage
);
router.post(
  "/:id/images",
  auth,
  checkPermission([Role.Admin, Role.SpAdmin]),
  upload.single("image"),
  addProductImage
);

router.patch(
  "/:id/list",
  auth,
  checkPermission([Role.Admin, Role.SpAdmin]),
  validate("listProduct"),
  listProduct
);

router.post(
  "/:id/change-price",
  auth,
  checkPermission([Role.Admin, Role.SpAdmin]),
  validate("changeProductPrice"),
  changeProductPrice
);

router.get("/brands", getBrands);

module.exports = router;
