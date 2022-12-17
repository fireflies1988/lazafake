const { validationResult } = require("express-validator");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const CartItem = require("../models/cartItemModel");
const Promotion = require("../models/promotionModel");
const moment = require("moment");

// @desc    Add a product to cart
// @route   POST /api/cart/add?productId=
// @access  Private
const addToCart = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

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

  if (product.deleted) {
    res.status(409);
    throw new Error("Can't add deleted product to cart.");
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
    await CartItem.deleteOne({ _id: item });
  }

  res.json(items);
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

  const cartItem = updatedItem.toJSON();
  // add discount
  const promotions = await Promotion.find({});
  const currentPromotion = promotions.filter(
    (p) => moment().isBetween(p.from, p.to) && p.terminated === false
  )[0]; // get happening promotion only

  cartItem.discount = 0;
  if (currentPromotion) {
    for (const p of currentPromotion.products) {
      if (p.product.toString() === cartItem.product._id.toString()) {
        cartItem.discount = p.discount;
        break;
      }
    }
  }

  res.json(cartItem);
});

// @desc    View cart
// @route   GET /api/cart/view
// @access  Private
const getCartItems = asyncHandler(async (req, res, next) => {
  const cartItems = await CartItem.find({ user: req.user.id })
    .populate("product")
    .lean();

  // automatically update items' quantity if they exceed the maximum quantity of the product.
  // automatically delete items that are marked as deleted or have quantity === 0
  for (const item of cartItems) {
    if (item.product.deleted) {
      await CartItem.deleteOne({ _id: item._id });
    } else if (item.product.quantity === 0) {
      await CartItem.deleteOne({ _id: item._id });
    } else if (item.quantity > item.product.quantity) {
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

  // add discount
  const promotions = await Promotion.find({});
  const currentPromotion = promotions.filter(
    (p) => moment().isBetween(p.from, p.to) && p.terminated === false
  )[0]; // get happening promotion only

  cartItems.map((cartItem) => {
    cartItem.discount = 0;

    if (currentPromotion) {
      for (const p of currentPromotion.products) {
        if (p.product.toString() === cartItem.product._id.toString()) {
          cartItem.discount = p.discount;
          break;
        }
      }
    }

    return cartItem;
  });

  res.json(cartItems);
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
