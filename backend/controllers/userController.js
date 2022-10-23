const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { generateTokens } = require("../utils/jwt");
const { validationResult } = require("express-validator/check");

// @desc    Register
// @access  Public
// @route   POST /api/users
const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { fullName, email, password, confirmPassword } = req.body;

  // check passwords
  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match.");
  }

  // check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error("User already exists.");
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
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    });
  }
});

// @desc    Login
// @access  Public
// @route   POST /api/users/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check user's email
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    // save refresh token
    const salt = await bcrypt.genSalt(10);
    const refreshTokenHash = await bcrypt.hash(refreshToken, salt);
    user.refreshTokenHash = refreshTokenHash;
    await user.save();

    res.json({
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
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc    Get new access token
// @route   POST /api/users/refresh-token
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
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
const updateMe = asyncHandler(async (req, res) => {
  const { email, refreshTokenHash, role, passwordHash, ...updatedFields } =
    req.body;

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
const changePassword = asyncHandler(async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    res.status(400);
    throw new Error("Passwords do not match.");
  }

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
    message: "Your password has been changed successfully."
  });
});

module.exports = {
  register,
  login,
  getMe,
  refreshToken,
  updateMe,
  changePassword,
};
