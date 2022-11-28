const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const paypal = require("../configs/paypal");
const Address = require("../models/addressModel");
const CartItem = require("../models/cartItemModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Voucher = require("../models/voucherModel");
const voucherHelper = require("../helpers/voucherHelper");

// @desc    Place order
// @route   POST /api/orders
// @access  Private
const placeOrder = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { user, totalPayment, status, currency, isValid, ...fields } = req.body;

  // check shipping address
  const address = await Address.findById(fields.shippingAddress);
  if (!address) {
    res.status(400);
    throw new Error("Address not found.");
  }

  if (address.user.toString() !== req.user.id) {
    res.status(400);
    throw new Error("This is not your address.");
  }

  let payment = Number(fields.shippingFee);
  let orderItems = []; // for later use (payment)

  // check quantity again
  let errMessages = [];
  for (let itemId of fields.orderItems) {
    const cartItem = await CartItem.findById(itemId).populate("product");
    orderItems.push(cartItem);
    if (cartItem.user.toString() !== req.user.id) {
      res.status(400);
      throw new Error(`This item ${cartItem.id} is not in your cart`);
    }

    if (cartItem.quantity > cartItem.product.quantity) {
      errMessages.push(
        `There are not enough '${cartItem.product.name}' in stock (remaining ${cartItem.product.quantity}). Please adjust the quantity of this item.`
      );
    } else {
      payment += cartItem.quantity * cartItem.product.price;
    }
  }

  if (errMessages.length > 0) {
    return res.status(409).json(errMessages);
  }

  // check applied vouchers
  let discountAmount = 0;
  if (fields.vouchers) {
    const voucherTypes = new Set();
    for (const voucherId of fields.vouchers) {
      const voucher = await Voucher.findById(voucherId);

      voucherHelper.checkConditions(res, voucher, req.user.id, payment);

      // if everything is okay, calculate discount amount
      if (voucherTypes.has(voucher.type)) {
        res.status(422);
        throw new Error("You can't use the same two vouchers for one order.");
      }
      voucherTypes.add(voucher.type);
      if (voucher.isPercentageDiscount) {
        if (
          (payment * voucher.discountAmount) / 100 >
          voucher.maxDiscountAmount
        ) {
          discountAmount += voucher.maxDiscountAmount;
        } else {
          discountAmount += (payment * voucher.discountAmount) / 100;
        }
      } else {
        discountAmount += voucher.discountAmount;
      }
    }
    payment -= discountAmount;
  }

  // payment
  if (fields.paymentMethod === "Paypal") {
    const order = await Order.create({
      ...fields,
      user: req.user.id,
      totalPayment: payment,
      isValid: false,
    });

    // convert vnd to usd (paypal accepts usd only)
    let total =
      orderItems.reduce(
        (acc, obj) =>
          acc +
          (Math.round((obj.product.price / 23000) * 100) / 100) * obj.quantity,
        0
      ) -
      Math.round((discountAmount / 23000) * 100) / 100;

    var create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http://localhost:5000/api/orders/confirm?orderId=${order.id}&totalPayment=${total}&userId=${req.user.id}`,
        cancel_url: `http://localhost:5000/api/orders/cancel?orderId=${order.id}`,
      },
      transactions: [
        {
          item_list: {
            items: [
              ...orderItems.map((item) => ({
                name: item.product.name,
                sku: item.product.sku,
                price: Math.round((item.product.price / 23000) * 100) / 100, // convert vnd to usd
                currency: "USD",
                quantity: item.quantity,
              })),
              {
                name: "Voucher discount",
                sku: "9999",
                price: -Math.round((discountAmount / 23000) * 100) / 100, // convert vnd to usd
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: total,
          },
          description: "This is the payment description.",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async function (error, payment) {
      if (error) {
        throw error;
      } else {
        console.log(payment);
        for (const link of payment.links) {
          if (link.rel === "approval_url") {
            return res.redirect(link.href);
          }
        }
      }
    });
  } else {
    const order = await Order.create({
      ...fields,
      user: req.user.id,
      totalPayment: payment,
    });
    res.status(201).json(order);
  }
});

// @desc    Confirm payment
// @route   GET /api/orders/confirm?orderId=&totalPayment=&userId=?
// @access  Private (redirect)
const confirmPayment = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.query.orderId).populate("orderItems");

  const execute_payment_json = {
    payer_id: req.query.PayerID,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: Number(req.query.totalPayment),
        },
      },
    ],
  };

  paypal.payment.execute(
    req.query.paymentId,
    execute_payment_json,
    async (error, payment) => {
      if (error) {
        throw error;
      } else {
        // update products' quantity after purchasing
        for (const item of order.orderItems) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: {
              quantity: -item.quantity,
            },
          });
        }

        // update vouchers
        for (const voucher of order.vouchers) {
          await Voucher.updateOne(
            { id: voucher.id },
            {
              $push: {
                usersUsed: req.query.userId,
              },
            }
          );
        }

        // this order become valid now
        order.isValid = true;
        await order.save();
        res.json(order);
      }
    }
  );
});

// @desc    Cancel payment
// @route   GET /api/orders/cancel?orderId=
// @access  Private (redirect)
const cancelPayment = asyncHandler(async (req, res, next) => {
  await Order.findByIdAndDelete(req.query.orderId);
  res.json("Payment canceled.");
});

// @desc    Update order status
// @route   PATCH /api/orders/:id
// @access  Private (admin)
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  if (order.status === "Canceled" || order.status === "Completed") {
    res.status(403);
    throw new Error("Unable to update the order status.");
  }
  order.status = req.body.status;
  await order.save();

  res.json(order);
});

// @desc    Get all orders
// @route   GET /api/orders?status=
// @access  Private (admin)
const viewOrders = asyncHandler(async (req, res, next) => {
  const statuses = [
    "To Pay",
    "To Ship",
    "To Receive",
    "Completed",
    "Canceled",
    "Return/Refund",
  ];
  const index = Number(req.query.status);
  if (index < statuses.length && index >= 0) {
    res.json(await Order.find({ status: statuses[index] }));
  } else {
    res.json(await Order.find({}));
  }
});

module.exports = {
  placeOrder,
  confirmPayment,
  cancelPayment,
  updateOrderStatus,
  viewOrders,
};
