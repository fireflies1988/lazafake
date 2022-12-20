const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const cloudinary = require("../configs/cloudinary");
const mongoose = require("mongoose");

// @desc    Add a new category
// @route   POST /api/categories
// @access  Private (admin)
const addCategory = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name } = req.body;

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    res.status(409);
    throw new Error("This category already exists.");
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const newCategory = new Category({ name });
    await newCategory.save({ session });

    // upload thumbnail
    if (req.file) {
      let uploadOptions = {
        public_id: `LazaFake/categories/${newCategory._id}`,
      };

      const uploadResult = await cloudinary.uploader.upload(
        req.file.path,
        uploadOptions
      );

      console.log(uploadResult);
      if (uploadResult.public_id && uploadResult.secure_url) {
        newCategory.thumbnail = {
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
        };
      }
    }

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }

  res.status(201).json(await Category.find({}));
});

// @desc    View category list
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res, next) => {
  res.json(await Category.find({}));
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private (admin)
const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found.");
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (category?.thumbnail?.publicId) {
      await cloudinary.uploader.destroy(category?.thumbnail?.publicId);
    }

    await Category.findByIdAndDelete(req.params.id, { session });
    await Product.updateMany(
      { category: req.params.id },
      {
        $set: {
          category: null,
        },
      },
      {
        session,
      }
    );

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }

  res.json(await Category.find({}));
});

// @desc    Update category
// @route   PATCH /api/categories/:id
// @access  Private (admin)
const updateCategory = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found.");
  }

  // upload image
  if (req.file) {
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      public_id: `LazaFake/categories/${category._id}`,
    });

    console.log(uploadResult);
    if (uploadResult.public_id && uploadResult.secure_url) {
      category.thumbnail = {
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
      };
    }
  }

  category.name = req.body.name;
  await category.save();

  res.json(await Category.find({}));
});

module.exports = {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,
};
