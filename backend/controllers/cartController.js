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

  // check if quantity is valid
  if (req.body.quantity < 1) {
    res.status(400);
    throw new Error("Invalid quantity!");
  }
  if (req.body.quantity > product.quantity) {
    res.status(409);
    throw new Error(
      `There are not enough '${product.name}' in stock (remaining ${product.quantity}). Please adjust the quantity of this item.`
    );
  }

  let newCartItem = await CartItem.create({
    user: req.user.id,
    product: req.query.productId,
    quantity: req.body.quantity,
  });
  newCartItem = await newCartItem.populate("product");

  res.json(newCartItem);
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
  deletedItem = await CartItem.findByIdAndDelete(req.query.cartItemId);

  res.json(deletedItem);
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

  // check quantity
  if (req.body.quantity < 1) {
    res.status(400);
    throw new Error("Invalid quantity!");
  }

  if (req.body.quantity > updatedItem.product.quantity) {
    res.status(409);
    throw new Error(
      `You can only buy maximum ${updatedItem.product.quantity} of this product.`
    );
  }

  updatedItem.quantity = req.body.quantity;
  await updatedItem.save();

  res.json(updatedItem);
});

// @desc    View cart
// @route   GET /api/cart/view
// @access  Private
const getCartItems = asyncHandler(async (req, res, next) => {
  const cartItems = await CartItem.find({ user: req.user.id }).populate(
    "product"
  );

  // automatically update items' quantity if they exceed the maximum quantity of the product.
  for (const item of cartItems) {
    if (item.quantity > item.product.quantity) {
      await CartItem.updateOne(
        { _id: item._id },
        {
          $set: {
            quantity: item.product.quantity,
          },
        }
      );
    }
  }

  res.json(await CartItem.find({ user: req.user.id }).populate("product"));
});

// @desc    Check out (check again if the quantity of the items you selected is valid)
// @route   POST /api/cart/checkout
// @access  Private
const checkOut = asyncHandler(async (req, res, next) => {
  const { items } = req.body;
  let messages = [];

  for (let itemId of items) {
    const cartItem = await CartItem.findById(itemId).populate("product");
    if (cartItem.quantity > cartItem.product.quantity) {
      messages.push(
        `There are not enough '${cartItem.product.name}' in stock (remaining ${cartItem.product.quantity}). Please adjust the quantity of this item.`
      );
    }
  }

  if (messages.length > 0) {
    res.status(409).json(messages);
  } else {
    res.status(200).json("Everything is Ok. Let's make an order now.");
  }
});

module.exports = {
  addToCart,
  removeFromCart,
  removeMultipleFromCart,
  changeQtyFromCart,
  getCartItems,
  checkOut,
};
