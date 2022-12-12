const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Voucher = require("../models/voucherModel");

// @desc    Create a new voucher
// @route   POST /api/vouchers
// @access  Private (admin)
const createVoucher = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { usersUsed, ...fields } = req.body;

  // check voucher code
  const existingVoucher = await Voucher.findOne({ code: fields.code });
  if (existingVoucher) {
    res.status(409);
    throw new Error(
      "This voucher code already exists. Please enter another one."
    );
  }

  if (
    fields.isPercentageDiscount === true ||
    fields.isPercentageDiscount === "true"
  ) {
    // maxDiscountAmount is required, discountAmount < 100
    if (fields.discountAdmount >= 100) {
      res.status(400);
      throw new Error("discountAmount can't exceed 100%.");
    }

    if (!fields.maxDiscountAmount) {
      res.status(400);
      throw new Error("maxDiscountAmount is required.");
    }
  }

  const voucher = await Voucher.create(fields);
  res.status(201).json(voucher);
});

// @desc    Delete a voucher
// @route   DELETE /api/vouchers/:id
// @access  Private (admin)
const deleteVoucher = asyncHandler(async (req, res, next) => {
  await Voucher.findByIdAndDelete(req.params.id);
  res.json(await Voucher.find({}));
});

// @desc    Get vouchers
// @route   GET /api/vouchers?expired=true
// @access  Private (admin)
const getVouchers = asyncHandler(async (req, res, next) => {
  if (req.query?.expired === "true") {
    return res.json(
      await Voucher.find({ expirationDate: { $lte: new Date().toISOString() } })
    );
  } else if (req.query?.expired === "false") {
    return res.json(
      await Voucher.find({
        expirationDate: { $gte: new Date().toISOString() },
      })
    );
  }
  res.json(await Voucher.find({}));
});

module.exports = {
  createVoucher,
  deleteVoucher,
  getVouchers,
};
