const express = require("express");
const {
  addReview,
  viewReview,
  editReview,
  getReivews,
} = require("../controllers/reviewController");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const { validate } = require("../utils/validator");

router.post("/", auth, validate("addReview"), addReview);
router.get("/:id", viewReview);
router.patch("/:id", auth, editReview);
router.get("/", getReivews);

module.exports = router;
