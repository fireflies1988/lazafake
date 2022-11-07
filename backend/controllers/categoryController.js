const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Category = require("../models/categoryModel");

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

  const newCategory = await Category.create({ name });
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
  await Category.findByIdAndDelete(req.params.id);

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

  await Category.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
  });

  res.json(await Category.find({}));
});

module.exports = {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,
};
