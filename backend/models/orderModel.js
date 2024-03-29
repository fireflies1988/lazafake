const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shipper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      ward: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        enum: ["Work", "Home", "Other"],
        default: "Other",
      },
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          required: true,
          default: 0,
        },
        avgImportPrice: {
          type: Number,
        },
      },
    ],
    vouchers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voucher",
        required: true,
      },
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
    // totalPayment = orderItems * Price + shippingFee - discountAmount
    totalPayment: {
      type: Number,
    },
    message: {
      type: String,
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
    // done to pay
    confirmedAt: {
      type: Date,
    },
    // done to ship
    shippedOutAt: {
      type: Date,
    },
    // done to receive
    completedAt: {
      type: Date,
    },
    canceledAt: {
      type: Date,
    },
    returnAt: {
      type: Date,
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
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
