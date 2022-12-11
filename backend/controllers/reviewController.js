const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Review = require("../models/reviewModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// @desc    Write a review
// @route   POST /api/reviews
// @access  Private
const addReview = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { rating, comment, orderId, productId } = req.body;

  if (rating < 0 || rating > 5) {
    res.status(400);
    throw new Error("Rating must be between 1 and 5");
  }

  // check order
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(400);
    throw new Error("Order not found!");
  }

  if (order.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("This is not your order.");
  }

  if (order.status !== "Completed") {
    res.status(400);
    throw new Error("You can't review this.");
  }

  // check product
  const product = await Product.findById(productId);

  if (!product) {
    res.status(400);
    throw new Error("Product not found!");
  }

  if (!order.orderItems.map((i) => i.product.toString()).includes(product.id)) {
    res.status(400);
    throw new Error("This order doesn't contains this product!");
  }

  // check if you already reviewed this product
  const review = await Review.findOne({ order: orderId, product: productId });
  if (review) {
    res.status(400);
    throw new Error("You already wrote a review for this product.");
  }

  // pass
  const newReview = await Review.create({
    order: orderId,
    product: productId,
    user: req.user.id,
    rating,
    comment,
  });

  res.json(newReview);
});

// @desc    View review
// @route   GET /api/reviews/:id
// @access  Public
const viewReview = asyncHandler(async (req, res, next) => {
  res.json(await Review.findById(req.params.id));
});

// @desc    Edit review
// @route   PATCH /api/reviews/:id
// @access  Private
const editReview = asyncHandler(async (req, res, next) => {
  const { order, product, ...rest } = req.body;
  const review = await Review.findById(req.params.id);
  if (review.user.toString() !== req.user.id) {
    res.status(400);
    throw new Error("This is not your review.");
  }

  const newlyUpdatedReivew = await Review.findByIdAndUpdate(
    req.params.id,
    rest,
    {
      new: true,
    }
  );

  res.json(newlyUpdatedReivew);
});

// @desc    Get reviews
// @route   GET /api/reviews?productId=&userId=
// @access  Public
const getReivews = asyncHandler(async (req, res, next) => {
  let reviews = await Review.find({}).populate("user").sort({
    createdAt: -1,
  });

  if (req.query.productId) {
    reviews = reviews.filter(
      (r) => r.product.toString() === req.query.productId
    );
  }

  if (req.query.userId) {
    reviews = reviews.filter((r) => r.user.id === req.query.userId);
  }

  res.json(reviews);
});

module.exports = {
  addReview,
  viewReview,
  editReview,
  getReivews,
};
