const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    images: [
      {
        publicId: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    helpfuls: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamp: true,
  }
);

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sku: String,
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        publicId: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    specifications: {
      type: mongoose.Schema.Types.Mixed,
    },
    rating: {
      type: mongoose.Schema.Types.Decimal128,
    },
    quantity: {
      type: Number,
      required: true,
    },
    reviews: [reviewSchema],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    }
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Product", productSchema);