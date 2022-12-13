const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Product = require("../models/productModel");
const PriceHistory = require("../models/priceChangeModel");

// @desc    Get price history
// @route   POST /api/price-changes
// @access  Private (admin)
const getPriceChanges = asyncHandler(async (req, res, next) => {
  res.json(
    await PriceHistory.find({}).populate([
      {
        path: "user",
      },
      {
        path: "product",
        populate: {
          path: "category",
        },
      },
    ])
  );
});

module.exports = {
  getPriceChanges,
};
