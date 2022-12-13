const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Promotion = require("../models/promotionModel");
const moment = require("moment");
const Product = require("../models/productModel");

// @desc    Add a new promotion
// @route   POST /api/promotions
// @access  Private (admin)
const addPromotion = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, note, to, from, products } = req.body;
  console.log({ fromDate: from, toDate: to });

  if (from >= to) {
    res.status(400);
    throw new Error("Invalid date.");
  }

  if (moment().isAfter(from)) {
    res.status(400);
    throw new Error("Invalid start date.");
  }

  for (const product of products) {
    const tempProduct = await Product.findById(product.product);
    if (!tempProduct) {
      res.status(404);
      throw new Error(`${product.product} doesn't exist.`);
    }

    if (!product.discount) {
      res.status(400);
      throw new Error("Invalid discount.");
    }

    if (product.discount >= tempProduct.price) {
      res.status(400);
      throw new Error(
        "Discount price can't be greater than the original price."
      );
    }

    if (!tempProduct.listed) {
      res.status(400);
      throw new Error("Can't promote unlisted product.");
    }
  }

  // check conflict with another promotion event
  let promotions = await Promotion.find({});
  promotions = promotions.filter(
    (p) => moment().isBefore(p.to) && !p.terminated
  );
  for (const p of promotions) {
    if (
      moment(from).isBetween(p.from, p.to) ||
      moment(to).isBetween(p.from, p.to) ||
      moment(p.from).isBetween(from, to) ||
      moment(p.to).isBetween(from, to)
    ) {
      res.status(409);
      throw new Error(
        `The time period you selected was in conflict with another promotion event ${p._id}`
      );
    }
  }

  const newPromotion = await Promotion.create({
    user: req.user.id,
    name,
    note,
    from,
    to,
    products,
  });

  res.json(
    await Promotion.findById(newPromotion.id).populate([
      {
        path: "user",
      },
      {
        path: "products",
        populate: {
          path: "product",
        },
      },
    ])
  );
});

// @desc    Edit promotion
// @route   PUT /api/promotions/:id
// @access  Private (admin)
const editPromotion = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const promotion = await Promotion.findById(req.params.id).populate([
    {
      path: "user",
    },
    {
      path: "products",
      populate: {
        path: "product",
      },
    },
  ]);

  if (!promotion) {
    res.status(404);
    throw new Error("Promotion not found");
  }

  const { name, note, to, from, products } = req.body;

  if (from >= to) {
    res.status(400);
    throw new Error("Invalid date.");
  }

  if (moment().isAfter(from)) {
    res.status(400);
    throw new Error("Invalid start date.");
  }

  for (const product of products) {
    const tempProduct = await Product.findById(product.product);
    if (!tempProduct) {
      res.status(404);
      throw new Error(`${product.product} doesn't exist.`);
    }

    if (!product.discount) {
      res.status(400);
      throw new Error("Invalid discount.");
    }

    if (product.discount >= tempProduct.price) {
      res.status(400);
      throw new Error(
        "Discount price can't be greater than the original price."
      );
    }

    if (!tempProduct.listed) {
      res.status(400);
      throw new Error("Can't promote unlisted product.");
    }
  }

  // check conflict with another promotion event
  let promotions = await Promotion.find({});
  promotions = promotions.filter(
    (p) =>
      p._id.toString() !== promotion.id &&
      moment().isBefore(p.to) &&
      !p.terminated
  );
  for (const p of promotions) {
    if (
      moment(from).isBetween(p.from, p.to) ||
      moment(to).isBetween(p.from, p.to) ||
      moment(p.from).isBetween(from, to) ||
      moment(p.to).isBetween(from, to)
    ) {
      res.status(409);
      throw new Error(
        `The time period you selected was in conflict with another promotion event ${p._id}`
      );
    }
  }

  promotion.name = name;
  promotion.note = note;
  promotion.from = from;
  promotion.to = to;
  promotion.products = products;
  await promotion.save();

  res.json(
    await Promotion.findById(promotion.id).populate([
      {
        path: "user",
      },
      {
        path: "products",
        populate: {
          path: "product",
        },
      },
    ])
  );
});

// @desc    Delete promotion
// @route   DELETE /api/promotions/:id
// @access  Private (admin)
const deletePromotion = asyncHandler(async (req, res, next) => {
  const promotion = await Promotion.findById(req.params.id);
  if (!promotion) {
    res.status(400);
    throw new Error("Promotion not found.");
  }

  if (moment().isAfter(promotion.from) || promotion.terminated === true) {
    res.status(409);
    throw new Error(
      "You can't delete the promotion that is happening or ended."
    );
  }

  await Promotion.deleteOne({ _id: promotion.id });

  res.json(promotion);
});

// @desc    Get promotions
// @route   GET /api/promotions
// @access  Private (admin)
const getPromotions = asyncHandler(async (req, res, next) => {
  let promotions = await Promotion.find({}).populate([
    {
      path: "user",
    },
    {
      path: "products",
      populate: {
        path: "product",
      },
    },
  ]);

  if (req.query.status === "Not Started") {
    promotions = promotions.filter(
      (p) => moment().isBefore(p.from) && p.terminated === false
    );
  } else if (req.query.status === "Happening") {
    promotions = promotions.filter(
      (p) => moment().isBetween(p.from, p.to) && p.terminated === false
    );
  } else if (req.query.status === "Ended") {
    promotions = promotions.filter(
      (p) => moment().isAfter(p.to) || p.terminated === true
    );
  }

  res.json(promotions);
});

module.exports = {
  addPromotion,
  deletePromotion,
  getPromotions,
  editPromotion,
};
