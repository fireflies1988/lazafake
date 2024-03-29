const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Product = require("../models/productModel");
const cloudinary = require("../configs/cloudinary");
const { removeAccents, containsAccents } = require("../utils/accentUtils");
const moment = require("moment");
const Order = require("../models/orderModel");
const Review = require("../models/reviewModel");
const PriceChange = require("../models/priceChangeModel");
const Receipt = require("../models/receiptModel");
const Promotion = require("../models/promotionModel");
const mongoose = require("mongoose");

// @desc    Add a new product
// @route   POST /api/products
// @access  Private (admin)
const addProduct = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { images, price, quantity, reviews, rating, ...fields } = req.body;
  const newProduct = await Product.create(fields);

  // handle images
  const uploadOptions = {
    folder: `LazaFake/products/${newProduct._id}`,
  };
  let uploadedImages = [];
  for (const file of req.files) {
    const uploadResult = await cloudinary.uploader.upload(
      file.path,
      uploadOptions
    );

    if (uploadResult.public_id && uploadResult.secure_url) {
      uploadedImages.push({
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
      });
    }
  }
  newProduct.images = uploadedImages;

  await newProduct.save();
  res
    .status(201)
    .json(await Product.findById(newProduct.id).populate("category"));
});

// @desc    List a product
// @route   PATCH /api/products/:id/list
// @access  Private (admin)
const listProduct = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const product = await Product.findById(req.params.id).populate("category");
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  if (product.listed) {
    res.status(409);
    throw new Error("This product is already listed!");
  }

  product.price = req.body.price;
  product.listed = true;
  await product.save();

  res.json(product);
});

// @desc    Change product price
// @route   POST /api/products/:id/change-price
// @access  Private (admin)
const changeProductPrice = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const product = await Product.findById(req.params.id).populate("category");
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  const oldPrice = product.price;
  const { newPrice } = req.body;
  if (oldPrice === newPrice) {
    res.status(400);
    throw new Error("No changes found.");
  }

  product.price = newPrice;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await PriceChange.create({
      user: req.user.id,
      product: req.params.id,
      oldPrice: oldPrice,
      newPrice: newPrice,
    });

    await product.save();
    await session.commitTransaction();

    res.json(product);
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
});

// @desc    Add a new product image
// @route   POST /api/products/:id/images
// @access  Private (admin)
const addProductImage = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  if (req.file) {
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: `LazaFake/products/${product._id}`,
    });

    if (uploadResult.public_id && uploadResult.secure_url) {
      product.images.push({
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
      });
    }
  }

  await product.save();
  res.json(product.images);
});

// @desc    Remove a product image
// @route   DELETE /api/products/:productId/images/:imageId
// @access  Private (admin)
const removeProductImage = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  const productImage = product.images.id(req.params.imageId);
  if (productImage) {
    await cloudinary.uploader.destroy(productImage.publicId);
  }

  product.images.pull(req.params.imageId);
  await product.save();

  res.json(product.images);
});

// @desc    Get product list
// @route   GET /api/products?category=&limit=&
// @access  Public
const getProducts = asyncHandler(async (req, res, next) => {
  let products = await Product.find({ deleted: false })
    .populate("category")
    .limit(req.query.limit)
    .lean();

  const keyword = removeAccents(req.query.keyword ?? "").toLowerCase();
  if (keyword) {
    products = products.filter(
      (p) =>
        removeAccents(p.name).toLowerCase().includes(keyword) ||
        removeAccents(p.description).toLowerCase().includes(keyword) ||
        removeAccents(p?.specifications ?? "")
          .toLowerCase()
          .includes(keyword) ||
        removeAccents(p?.category.name).toLowerCase().includes(keyword) ||
        removeAccents(p?.brand ?? "")
          .toLowerCase()
          .includes(keyword)
    );
  }

  if (req.query.listed === "true") {
    products = products.filter((p) => p.listed === true);
  } else if (req.query.listed === "false") {
    products = products.filter((p) => p.listed === false);
  }

  if (req.query.category) {
    products = products.filter((p) => p?.category.name === req.query.category);
  }

  if (req.query.brands) {
    products = products.filter((p) =>
      removeAccents(req.query.brands)
        .toLowerCase()
        .includes(removeAccents(p?.brand ?? "").toLowerCase())
    );
  }

  if (req.query.minPrice) {
    products = products.filter((p) => p.price >= req.query.minPrice);
  }

  if (req.query.maxPrice) {
    products = products.filter((p) => p.price <= req.query.maxPrice);
  }

  if (req.query.sortBy === "price") {
    if (req.query.order === "asc") {
      products.sort((a, b) => a.price - b.price);
    }

    if (req.query.order === "desc") {
      products.sort((a, b) => b.price - a.price);
    }
  }

  if (req.query.sortBy === "sales") {
    products.sort((a, b) => b.sold - a.sold);
  }

  if (req.query.sortBy === "newest") {
    products.sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0
    );
  }

  // add mostRecentSale
  const orders = await Order.find({ status: "Completed" }).sort({
    completedAt: -1,
  });

  products.map((product) => {
    product.mostRecentSale = {
      label: "None",
      value: Number.MAX_VALUE,
    };
    for (let order of orders) {
      if (
        order.orderItems
          .map((i) => i.product.toString())
          .includes(product._id.toString())
      ) {
        if (order?.completedAt) {
          product.mostRecentSale = {
            label: moment(order?.completedAt).fromNow(),
            value: moment().unix() - moment(order?.completedAt).unix(),
          };
          break;
        }
      }
    }

    return product;
  });

  // add average rating
  await Promise.all(
    products.map(async (product) => {
      const reviews = await Review.find({
        product: product._id.toString(),
      }).lean();

      product.ratingCount = reviews.length;
      product.averageRating = 0;

      if (reviews.length > 0) {
        product.averageRating =
          reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;
      }

      return product;
    })
  );

  // add discount
  const promotions = await Promotion.find({});
  const currentPromotion = promotions.filter(
    (p) => moment().isBetween(p.from, p.to) && p.terminated === false
  )[0]; // get happening promotion only
  products.map((product) => {
    product.discount = 0;

    if (currentPromotion) {
      for (const p of currentPromotion?.products) {
        if (p.product.toString() === product._id.toString()) {
          product.discount = p.discount;
          break;
        }
      }
    }

    return product;
  });

  if (req.query.onSale === "true") {
    products = products.filter((p) => p.discount > 0);
  }

  res.status(200).json(products);
});

const toTitleCase = (phrase) =>
  phrase
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// @desc    Get brands
// @route   GET /api/products/brands
// @access  Public
const getBrands = asyncHandler(async (req, res, next) => {
  const products = await Product.find({});
  const brands = new Set();
  for (const product of products) {
    if (product?.brand) {
      brands.add(product.brand.trim().toLowerCase());
    }
  }

  res.json(Array.from(brands).map((b) => toTitleCase(b)));
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (admin)
const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.deleted) {
    res.status(409);
    throw new Error("This product is already deleted.");
  }

  // listed => don't allow deleting completely
  if (product.listed) {
    product.deleted = true;
    await product.save();
    return res.json(product);
  }

  // unlisted and have imported products => don't allow deleting completely => soft delete
  const receipts = await Receipt.find({});
  for (const receipt of receipts) {
    if (
      receipt.products.filter((p) => p.product.toString() === product.id)
        .length > 0
    ) {
      product.deleted = true;
      await product.save();
      return res.json(product);
    }
  }

  // unlisted and never imports products => allow deleting completely
  try {
    // remove cloudinary folder
    await cloudinary.api.delete_resources_by_prefix(
      `LazaFake/products/${req.params.id}`
    );
    await cloudinary.api.delete_folder(`LazaFake/products/${req.params.id}`);
  } catch (err) {
    console.log("deleteProduct: ", err);
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json(product);
});

// @desc    Update product
// @route   PATCH /api/products/:id
// @access  Private (admin)
const updateProduct = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { images, reviews, rating, deletedImages, sold, ...updatedFields } =
    req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  // delete removed images
  if (Array.isArray(deletedImages)) {
    for (const imageId of deletedImages) {
      const productImage = product.images.id(imageId);
      if (productImage) {
        await cloudinary.uploader.destroy(productImage.publicId);
        product.images.pull(imageId);
      }
    }
  } else {
    const productImage = product.images.id(deletedImages);
    if (productImage) {
      await cloudinary.uploader.destroy(productImage.publicId);
      product.images.pull(deletedImages);
    }
  }

  // upload new images
  const uploadOptions = {
    folder: `LazaFake/products/${product._id}`,
  };

  for (const file of req.files) {
    const uploadResult = await cloudinary.uploader.upload(
      file.path,
      uploadOptions
    );

    if (uploadResult.public_id && uploadResult.secure_url) {
      product.images.push({
        publicId: uploadResult.public_id,
        url: uploadResult.secure_url,
      });
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await product.save();
    await Product.findByIdAndUpdate(req.params.id, updatedFields);

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }

  res.json(await Product.findById(product.id).populate("category"));
});

module.exports = {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  removeProductImage,
  addProductImage,
  listProduct,
  changeProductPrice,
  getBrands,
};
