const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Receipt = require("../models/receiptModel");
const Product = require("../models/productModel");
const mongoose = require("mongoose");

// @desc    Add a new receipt
// @route   POST /api/receipts
// @access  Private (admin)
const addReceipt = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const { products } = req.body;
  let totalPrice = 0;
  for (const product of products) {
    if (!product.price) {
      res.status(400);
      throw new Error("Invalid price value!");
    }

    if (!product.quantity) {
      res.status(400);
      throw new Error("Invalid quantity value!");
    }

    totalPrice += product.price * product.quantity;
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (const product of products) {
      await Product.updateOne(
        { _id: product.product },
        {
          $inc: {
            quantity: product.quantity,
          },
        },
        {
          session,
        }
      );
    }

    const receipt = await new Receipt({
      user: req.user.id,
      products,
      totalPrice,
    }).save({ session });
    
    await session.commitTransaction();

    res.json(
      await Receipt.findById(receipt.id).populate([
        {
          path: "products",
          populate: {
            path: "product",
          },
        },
        {
          path: "user",
        },
      ])
    );
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
});

// @desc    Get receipts
// @route   GET /api/receipts
// @access  Private (admin)
const getReceipts = asyncHandler(async (req, res, next) => {
  res.json(
    await Receipt.find({}).populate([
      {
        path: "products",
        populate: {
          path: "product",
        },
      },
      {
        path: "user",
      },
    ])
  );
});

module.exports = {
  addReceipt,
  getReceipts,
};
