const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
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
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);