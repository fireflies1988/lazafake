const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const { generateTokens, generateRandomSixDigits } = require("../utils/jwt");
const { validationResult } = require("express-validator");
const cloudinary = require("../configs/cloudinary");
const Voucher = require("../models/voucherModel");
const Order = require("../models/orderModel");
const Notification = require("../models/notificationModel");
const mailService = require("../services/mailService");
const crypto = require("crypto");

// @desc    Register
// @route   POST /api/users
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { fullName, email, password } = req.body;

  // check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error("Email already exists.");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // create user
  res.status(400);
  const user = await User.create({
    fullName,
    email,
    passwordHash: passwordHash,
  });

  if (user) {
    // login after registration
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    // save refresh token
    const salt = await bcrypt.genSalt(10);
    user.refreshTokenHash = await bcrypt.hash(refreshToken, salt);
    await user.save();

    const { passwordHash, refreshTokenHash, ...publicFields } = user.toObject();

    res.status(201).json({
      ...publicFields,
      accessToken,
      refreshToken,
    });
  }
});

// @desc    Login
// @route   POST /api/users/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check user's email
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    // save refresh token
    const salt = await bcrypt.genSalt(10);
    user.refreshTokenHash = await bcrypt.hash(refreshToken, salt);
    await user.save();

    const { passwordHash, refreshTokenHash, ...publicFields } = user.toObject();

    res.json({
      ...publicFields,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400);
    throw new Error("Incorrect email or password.");
  }
});

// @desc    View my profile
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
  res.json(req.user);
});

// @desc    Get new access token
// @route   POST /api/users/refresh-token
// @access  Public
const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400);
    throw new Error("Please provide the refreshToken.");
  }

  try {
    // throw error if refresh-token is invalid or expired
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );
    console.log(decoded);

    const user = await User.findById(decoded.id);
    if (await bcrypt.compare(refreshToken, user.refreshTokenHash)) {
      const { accessToken } = generateTokens(user.id, user.role);

      res.json({ accessToken });
    } else {
      res.status(401);
      throw new Error("Invalid refresh token.");
    }
  } catch (err) {
    res.status(401).json(err);
  }
});

// @desc    Update my profile
// @route   PATCH /api/users/me
// @access  Private
const updateMe = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const {
    avatar,
    email,
    refreshTokenHash,
    role,
    passwordHash,
    addresses,
    ...updatedFields
  } = req.body;

  // upload image
  if (req.file) {
    let uploadOptions = {};
    if (req.user?.avatar?.publicId) {
      uploadOptions.public_id = req.user.avatar.publicId;
    } else {
      uploadOptions.folder = "LazaFake/users";
    }

    const uploadResult = await cloudinary.uploader.upload(
      req.file.path,
      uploadOptions
    );

    console.log(uploadResult);
    if (uploadResult.public_id && uploadResult.secure_url) {
      updatedFields.avatar = {
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }
  }

  res.status(400);
  const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedFields, {
    new: true,
    runValidators: true,
    select: "-passwordHash -refreshTokenHash",
  });

  res.status(200).json(updatedUser);
});

// @desc    Change password
// @route   PATCH /api/users/me/password/change
// @access  Private
const changePassword = asyncHandler(async (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  const user = await User.findById(req.user.id);
  if ((await bcrypt.compare(currentPassword, user.passwordHash)) === false) {
    res.status(422);
    throw new Error("Incorrect current password.");
  }

  // update passwordHash field
  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(newPassword, salt);

  res.status(400);
  await user.save();
  res.status(200).json({
    message: "Your password has been changed successfully.",
  });
});

// @desc    View your vouchers
// @route   GET /api/users/me/vouchers
// @access  Private
const viewMyVouchers = asyncHandler(async (req, res, next) => {
  let vouchers = await Voucher.find({
    expirationDate: { $gt: new Date().toISOString() },
  });

  // remove vouchers that you already used
  vouchers = vouchers.filter(
    (voucher) => voucher.usersUsed.indexOf(req.user.id) <= -1
  );

  res.json(vouchers);
});

// @desc    View your orders
// @route   GET /api/users/me/orders
// @access  Private
const viewMyOrders = asyncHandler(async (req, res, next) => {
  res.json(
    await Order.find({ user: req.user.id, isValid: true })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
        },
      })
      .sort({
        createdAt: -1,
      })
  );
});

// @desc    Cancel order
// @route   PATCH /api/users/me/orders/:id
// @access  Private
const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("This is not your order.");
  }

  if (order.status !== "To Pay" && order.status !== "To Ship") {
    res.status(409);
    throw new Error("Can't cancel the order.");
  }

  order.status = "Canceled";
  if (req.body.cancellationReason) {
    order.cancellationReason = req.body.cancellationReason;
  }
  await order.save();

  res.json(order);
});

// @desc    Get my notifications
// @route   GET /api/users/me/notifications
// @access  Private
const getMyNotifications = asyncHandler(async (req, res, next) => {
  res.json(
    await Notification.find({ user: req.user.id }).limit(req.query.limit).sort({
      createdAt: -1,
    })
  );
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = asyncHandler(async (req, res, next) => {
  res.json(await User.find({}));
});

// @desc    Send verification code
// @route   POST /api/users/me/mail/send-verification-code
// @access  Private
const sendVerificationCode = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const verificationCode = generateRandomSixDigits();
  user.verificationCodeHash = await bcrypt.hash(
    verificationCode,
    await bcrypt.genSalt(10)
  );
  user.verificationCodeExpiresAt = Date.now() + 5 * 60000;

  await user.save();

  mailService.sendVerificationCode(
    user.email,
    verificationCode,
    (err, info) => {
      if (err) {
        res.json(500);
        throw err;
      } else {
        res.json({
          message: `An email with a verification code was just sent to ${user?.email}. Please check your inbox and enter it below to verify your email address.`,
          verificationCodeExpiresAt: user.verificationCodeExpiresAt,
        });
      }
    }
  );
});

// @desc    Verify email address
// @route   POST /api/users/me/mail/verify
// @access  Private
const verifyEmailAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (await bcrypt.compare(req.body.code, user?.verificationCodeHash)) {
    if (user?.verificationCodeExpiresAt < Date.now()) {
      // code has expired
      res.status(422);
      throw new Error(
        "The verification code has expired. Please click 'Get Verification Code' to get a new one."
      );
    } else {
      user.verified = true;
      await user.save();
      return res.status(200).json({
        message: "Your email has been verified.",
        verified: user.verified,
      });
    }
  }

  res.status(422);
  throw new Error("Invalid verification code.");
});

// @desc    Send password reset
// @route   POST /api/users/password/forgot
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(400);
    throw new Error("Email doesn't exist.");
  }

  if (!user.verified) {
    res.status(422);
    throw new Error("This email isn't verified yet.");
  }

  const resetPasswordToken = crypto.randomBytes(16).toString("hex");
  const newPassword = generateRandomSixDigits();

  user.resetPasswordTokenHash = await bcrypt.hash(
    resetPasswordToken,
    await bcrypt.genSalt(10)
  );
  user.resetPasswordTokenExpiresAt = Date.now() + 5 * 60000; // expires after 5 minutes
  await user.save();

  mailService.sendPasswordResetRequest(
    email,
    newPassword,
    resetPasswordToken,
    (err, info) => {
      if (err) {
        res.status(500);
        throw err;
      } else {
        res.json(
          "A password reset request was sent to your email. Please check your inbox and follow the instructions."
        );
      }
    }
  );
});

// @desc    Reset password
// @route   GET /api/users/password/reset?email=&newPassword=&resetPasswordToken=&
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, newPassword, resetPasswordToken } = req.query;
  console.log({ email, newPassword, resetPasswordToken });
  const user = await User.findOne({ email: email });
  if (!user) {
    res.redirect(
      "http://localhost:3000/login?error&message=Email doesn't exist."
    );
  }

  if (!user.verified) {
    res.redirect(
      "http://localhost:3000/login?error&message=This email isn't verified yet."
    );
  }

  // check reset password token
  if (await bcrypt.compare(resetPasswordToken, user.resetPasswordTokenHash)) {
    if (user.resetPasswordTokenExpiresAt < Date.now()) {
      // expired
      res.redirect(
        "http://localhost:3000/login?error&message=The reset password token has expired."
      );
    } else {
      user.passwordHash = await bcrypt.hash(
        newPassword,
        await bcrypt.genSalt(10)
      );
      await user.save();
      res.redirect(
        "http://localhost:3000/login?success&message=Your password has been reset. Please log in with your new password."
      );
    }
  }
  res.redirect(
    "http://localhost:3000/login?error&message=Invalid reset password token."
  );
});

// @desc    Change role
// @route   PATCH /api/users/:id/role/change
// @access  Private (spadmin)
const changeRole = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  if (req.user.role !== "spadmin") {
    res.status(403);
    throw new Error("You don't have permission to access this resource.");
  }

  const user = await User.findById(req.params.id).select(
    "-passwordHash -resetTokenHash"
  );
  if (!user) {
    res.status(400);
    throw new Error("User not found.");
  }

  user.role = req.body.role;
  await user.save();

  res.json(user);
});

module.exports = {
  register,
  login,
  getMe,
  refreshToken,
  updateMe,
  changePassword,
  viewMyVouchers,
  viewMyOrders,
  cancelOrder,
  getMyNotifications,
  getUsers,
  sendVerificationCode,
  verifyEmailAddress,
  forgotPassword,
  resetPassword,
  changeRole,
};
