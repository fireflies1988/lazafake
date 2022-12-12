const mongoose = require("mongoose");
const moment = require("moment");

const voucherSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["Free Shipping", "LazaFake"],
      required: true,
    },
    limit: {
      type: Number,
    },
    usersUsed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    isPercentageDiscount: {
      type: Boolean,
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    maxDiscountAmount: {
      type: Number,
    },
    minSpend: {
      type: Number,
      required: true,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
      default: moment().add(15, "days").toISOString(),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Voucher", voucherSchema);
