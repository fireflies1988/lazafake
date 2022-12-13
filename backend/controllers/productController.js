const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Product = require("../models/productModel");
const cloudinary = require("../configs/cloudinary");
const { removeAccents, containsAccents } = require("../utils/accentUtils");
const moment = require("moment");
const Order = require("../models/orderModel");
const Review = require("../models/reviewModel");
const PriceChange = require("../models/priceChangeModel");

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

  await PriceChange.create({
    user: req.user.id,
    product: req.params.id,
    oldPrice: oldPrice,
    newPrice: newPrice,
  });

  await product.save();
  res.json(product);
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
  let products = await Product.find({})
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
        removeAccents(p?.category.name).toLowerCase().includes(keyword)
    );
  }

  if (req.query.listed === "true") {
    products = products.filter((p) => p.listed === true);
  } else if (req.query.listed === "false") {
    products = products.filter((p) => p.listed === false);
  }

  if (req.query.onSale === "true") {
    products = products.filter((p) => p.discount > 0);
  }

  if (req.query.category) {
    products = products.filter((p) => p?.category.name === req.query.category);
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
      console.log(order);
      if (
        order.orderItems
          .map((i) => i.product.toString())
          .includes(product._id.toString())
      ) {
        if (order?.completedAt) {
          product.mostRecentSale = {
            label: moment(order?.completedAt).startOf("day").fromNow(),
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

  console.log(products);

  res.status(200).json(products);
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
  if (deletedImages?.length > 0) {
    for (const imageId of deletedImages) {
      const productImage = product.images.id(imageId);
      if (productImage) {
        await cloudinary.uploader.destroy(productImage.publicId);
        product.images.pull(imageId);
      }
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

  await product.save();
  await Product.findByIdAndUpdate(req.params.id, updatedFields);

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
};
