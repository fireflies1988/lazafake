const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    refreshTokenHash: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },
    dateOfBirth: {
      type: Date,
    },
    avatar: {
      publicId: String,
      url: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    addresses: [
      new mongoose.Schema(
        {
          fullName: {
            type: String,
            required: true,
          },
          phoneNumber: {
            type: Number,
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
          isDefault: {
            type: Boolean,
            required: true,
            default: false,
          },
        },
        {
          timestamps: true,
        }
      ),
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
