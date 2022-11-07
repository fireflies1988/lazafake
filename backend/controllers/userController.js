const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { generateTokens } = require("../utils/jwt");
const { validationResult } = require("express-validator");
const cloudinary = require("../configs/cloudinary");

// @desc    Register
// @route   POST /api/users
// @access  Public
const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { fullName, email, password, confirmPassword } = req.body;

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
// @route   POST /api/users/login
// @access  Public
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, refreshTokenHash, role, passwordHash, ...updatedFields } =
    req.body;

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
const changePassword = asyncHandler(async (req, res) => {
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

// @desc    Add address
// @route   POST /api/users/me/addresses
// @access  Private
// ?? need transaction
const addAddress = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  if (req.body.isDefault === "true" || req.body.isDefault === true) {
    await User.updateOne(
      { _id: req.user.id },
      {
        $set: {
          "addresses.$[].isDefault": false,
        },
      }
    );
  }

  res.status(400);
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $push: {
        addresses: {
          $each: [req.body],
          $sort: {
            isDefault: -1,
            createdAt: -1,
          },
        },
      },
    },
    {
      new: true,
      runValidators: true,
      select: "-passwordHash -refreshTokenHash",
    }
  );

  res.status(200).json(user.addresses);
});

// @desc    Delete address
// @route   DELETE /api/users/me/addresses/:id
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user.addresses.id(req.params.id)) {
    res.status(404);
    throw new Error("Address not found.");
  }
  user.addresses.pull(req.params.id);

  await user.save();

  // another way
  // const user = await User.findByIdAndUpdate(
  //   req.user.id,
  //   {
  //     $pull: {
  //       addresses: {
  //         _id: req.params.id,
  //       },
  //     },
  //   },
  //   {
  //     new: true,
  //     select: "-passwordHash -refreshTokenHash",
  //   }
  // );

  res.status(200).json(user.addresses);
});

// @desc    Update address
// @route   PATCH /api/users/me/addresses/:id
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const user = await User.findById(req.user.id);

  // only one default address is allowed
  if (req.body.isDefault === "true" || req.body.isDefault === true) {
    user.addresses.map((a) => (a.isDefault = false));
  }

  if (!user.addresses.id(req.params.id)) {
    res.status(404);
    throw new Error("Address not found.");
  }

  user.addresses.id(req.params.id).set({
    ...user.addresses.id(req.params.id),
    ...req.body,
  });

  user.addresses.sort((a, b) => {
    if (a.isDefault === false && b.isDefault === true) {
      return 1;
    } else if (a.isDefault === true && b.isDefault === false) {
      return -1;
    } else {
      return a.createdAt < b.createdAt;
    }
  });

  res.status(400);
  await user.save();

  res.status(200).json(user.addresses);
});

module.exports = {
  register,
  login,
  getMe,
  refreshToken,
  updateMe,
  changePassword,
  addAddress,
  deleteAddress,
  updateAddress,
};
