const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/roleMiddleware");
const Role = require("../data/roles");
const upload = require("../configs/multer");
const {
  updateBanners,
  getBanners,
} = require("../controllers/bannerController");

router.post(
  "/",
  auth,
  checkPermission([Role.Admin, Role.SpAdmin]),
  upload.array("banners"),
  updateBanners
);

router.get("/", getBanners);

module.exports = router;
