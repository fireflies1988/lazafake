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
    taxCode: {
      type: String,
    },
    shippingFee: {
      type: Number,
      required: true,
      default: 15.0,
    },
    totalPayment: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: [
        "To Pay",
        "To Ship",
        "To Receive",
        "Completed",
        "Canceled",
        "Return Refund",
      ],
      default: "To Pay",
    },
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
