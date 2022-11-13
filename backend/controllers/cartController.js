const { validationResult } = require("express-validator");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const CartItem = require("../models/cartItemModel");
const { update } = require("../models/productModel");

// @desc    Add a product to cart
// @route   POST /api/cart/add?productId=
// @access  Private
const addToCart = asyncHandler(async (req, res, next) => {
  if (!req.query.productId) {
    res.status(400);
    throw new Error(
      "Please provide param 'productId' and its value to the query string."
    );
  }

  const product = await Product.findById(req.query.productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  // check if product is added to cart
  const cartItem = await CartItem.findOne({
    user: req.user.id,
    product: req.query.productId,
  });
  if (cartItem) {
    res.status(409);
    throw new Error("This product is already in your cart.");
  }

  await CartItem.create({
    user: req.user.id,
    product: req.query.productId,
  });

  res.json(await CartItem.find({ user: req.user.id }));
});

// @desc    Remove a product from cart
// @route   DELETE /api/cart/remove?cartItemId=
// @access  Private
const removeFromCart = asyncHandler(async (req, res, next) => {
  if (!req.query.cartItemId) {
    res.status(400);
    throw new Error(
      "Please provide param 'cartItemId' and its value to the query string."
    );
  }

  const item = await CartItem.findById(req.query.cartItemId);
  if (!item) {
    res.status(404);
    throw new Error("Item not found.");
  }

  // remove item from cart
  await CartItem.findByIdAndDelete(req.query.cartItemId);

  res.json(await CartItem.find({ user: req.user.id }).populate("product"));
});

// @desc    Remove multiple products from cart
// @route   DELETE /api/cart/remove-multiple
// @access  Private
const removeMultipleFromCart = asyncHandler(async (req, res, next) => {
  const { items } = req.body;

  for (let item of items) {
    await CartItem.deleteOne({ id: item });
  }

  res.json(await CartItem.find({ user: req.user.id }).populate("product"));
});

// @desc    Change the quantity of a item in your cart
// @route   PATCH /api/cart/changeQty?cartItemId=&increase=true
// @access  Private
const changeQtyFromCart = asyncHandler(async (req, res, next) => {
  if (!req.query.cartItemId) {
    res.status(400);
    throw new Error(
      "Please provide param 'cartItemId' and its value to the query string."
    );
  }

  const updatedItem = await CartItem.findById(req.query.cartItemId).populate(
    "product"
  );
  if (!updatedItem) {
    res.status(404);
    throw new Error("Item not found.");
  }

  if (!req.query.increase || req.query.increase === "true") {
    if (updatedItem.quantity < updatedItem.product.quantity) {
      updatedItem.quantity++;
    } else {
      res.status(409);
      throw new Error(
        `You can only buy maximum ${updatedItem.product.quantity} of this product.`
      );
    }
  } else {
    if (updatedItem.quantity > 1) {
      updatedItem.quantity--;
    } else {
      res.status(409);
      throw new Error(
        "You have reached the minimum 1 in quantity, can't decrease more."
      );
    }
  }

  await updatedItem.save();

  res.json(await CartItem.find({ user: req.user.id }).populate("product"));
});

// @desc    View cart
// @route   GET /api/cart/view
// @access  Private
const viewCart = asyncHandler(async (req, res, next) => {
  const cartItems = await CartItem.find({ user: req.user.id }).populate(
    "product"
  );
  res.json(cartItems);
});

module.exports = {
  addToCart,
  removeFromCart,
  removeMultipleFromCart,
  changeQtyFromCart,
  viewCart,
};
