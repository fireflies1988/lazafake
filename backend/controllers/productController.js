const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Product = require("../models/productModel");
const cloudinary = require("../configs/cloudinary");

// @desc    Add a new product
// @route   POST /api/products
// @access  Private (admin)
const addProduct = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { images, reviews, rating, ...fields } = req.body;
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

  // console.log(fields.specifications);
  // if (fields.specifications?.length > 0) {
  //   for (const spec of fields.specifications) {
  //     newProduct.specifications.push(spec);
  //   }
  // }

  await newProduct.save();
  res
    .status(201)
    .json(await Product.findById(newProduct.id).populate("category"));
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
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res, next) => {
  res.status(200).json(await Product.find({}).populate("category"));
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

  const { images, reviews, rating, deletedImages, ...updatedFields } = req.body;

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
};
