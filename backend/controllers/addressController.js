const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const Address = require("../models/addressModel");

// @desc    Add address
// @route   POST /api/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const session = await Address.startSession();
  session.startTransaction();
  try {
    if (req.body.isDefault === "true" || req.body.isDefault === true) {
      await Address.updateMany(
        { user: req.user.id },
        {
          $set: {
            isDefault: false,
          },
        }
      );
    }

    await Address.create({
      user: req.user.id,
      ...req.body,
    });

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }

  res.status(201).json(
    await Address.find({ user: req.user.id }, null, {
      sort: {
        createdAt: -1,
        isDefault: -1,
      },
    })
  );
});

// @desc    Get all addressese
// @route   GET /api/addresses
// @access  Private
const getAddresses = asyncHandler(async (req, res, next) => {
  res.status(200).json(
    await Address.find({ user: req.user.id }, null, {
      sort: {
        createdAt: -1,
        isDefault: -1,
      },
    })
  );
});

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = asyncHandler(async (req, res, next) => {
  const address = await Address.findById(req.params.id);
  if (!address) {
    res.status(404);
    throw new Error("Address not found.");
  }

  if (address.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("This address is not yours.");
  }

  await Address.findByIdAndDelete(req.params.id);

  res.status(200).json(
    await Address.find({ user: req.user.id }, null, {
      sort: {
        createdAt: -1,
        isDefault: -1,
      },
    })
  );
});

// @desc    Update address
// @route   PATCH /api/addresses/:id
// @access  Private
const updateAddress = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { user, ...updatedFields } = req.body;

  const updatedAddress = await Address.findById(req.params.id);
  if (!updatedAddress) {
    res.status(404);
    throw new Error("Address not found.");
  }

  if (updatedAddress.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("This address is not yours");
  }

  const session = await Address.startSession();
  session.startTransaction();
  try {
    // only one default address is allowed
    if (
      updatedAddress.isDefault !== false &&
      (req.body.isDefault === "true" || req.body.isDefault === true)
    ) {
      await Address.updateMany(
        { user: req.user.id },
        {
          $set: {
            isDefault: false,
          },
        }
      );
    }

    await Address.findByIdAndUpdate(req.params.id, updatedFields);

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }

  res.status(200).json(
    await Address.find({ user: req.user.id }, null, {
      sort: {
        createdAt: -1,
        isDefault: -1,
      },
    })
  );
});

module.exports = {
  addAddress,
  deleteAddress,
  updateAddress,
  getAddresses,
};
