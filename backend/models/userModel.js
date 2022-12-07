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
      type: String,
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
      enum: ["user", "admin", "spadmin"],
      default: "user",
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    verificationCodeHash: {
      type: String,
    },
    verificationCodeExpiresAt: {
      type: Date,
    },
    resetPasswordTokenHash: {
      type: String,
    },
    resetPasswordTokenExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
