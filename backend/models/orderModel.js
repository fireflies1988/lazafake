const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CartItem",
        required: true,
      },
    ],
    vouchers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voucher",
        required: true,
      }
    ],
    taxCode: {
      type: String,
    },
    currency: {
      type: String,
      required: true,
      default: "vnd",
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    // totalPayment = orderItems * Price + shippingFee
    totalPayment: {
      type: Number,
    },
    status: {
      type: String,
      enum: [
        "To Pay",
        "To Ship",
        "To Receive",
        "Completed",
        "Canceled",
        "Return/Refund",
      ],
      default: "To Pay",
    },
    cancellationReason: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Paypal"],
      default: "Cash",
    },
    isValid: {
      type: Boolean,
      required: true,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
