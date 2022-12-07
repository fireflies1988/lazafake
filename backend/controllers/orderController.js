const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const paypal = require("../configs/paypal");
const Address = require("../models/addressModel");
const CartItem = require("../models/cartItemModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Voucher = require("../models/voucherModel");
const voucherHelper = require("../helpers/voucherHelper");
const puppeteer = require("puppeteer");
const Notification = require("../models/notificationModel");
const { sendMail } = require("../services/mailService");
const User = require("../models/userModel");

const USD_TO_VND = 24600;
const moneyFormatter = new Intl.NumberFormat("vi-vn", {
  style: "currency",
  currency: "vnd",
});

function sendNotification(
  orderId,
  userEmail,
  userFullName,
  tableData,
  shippingFee,
  totalPayment
) {
  sendMail({
    to: userEmail,
    subject: "Order Successfully Placed",
    html: `<html>
    <head>
      <style>
        table,
        th,
        td {
          border: 1px solid black;
          border-collapse: collapse;
          padding: 10px;
        }
      </style>
    </head>
    <body>
      <div>
        <h4>Hello ${userFullName},</h4>
        <p>
          Thank you for ordering. We received your order and will begin processing
          it soon.
        </p>
        <p>Your order ID: ${orderId}</p>
        <table>
          <tr>
            <th>Product</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Item Subtotal</th>
          </tr>
          ${tableData}
        </table>
        <p>Shipping Fee: ${shippingFee}</p>
        <p>Order Total: ${totalPayment}</p>
        <p>
          You will receive an email notification when there is an order update.
        </p>
      </div>
    </body>
  </html>`,
  });
}

// @desc    Place order
// @route   POST /api/orders
// @access  Private
const placeOrder = asyncHandler(async (req, res, next) => {
  if (!req.user.verified) {
    res.status(422);
    throw new Error("Please verify your email address first.");
  }

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
  for (let itemId of fields?.orderItems) {
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
    return res.status(409).json({ message: errMessages });
  }

  // check applied vouchers
  let discountAmount = 0;
  if (fields?.vouchers) {
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
          (Math.round((obj.product.price / USD_TO_VND) * 100) / 100) *
            obj.quantity,
        0
      ) -
      Math.round((discountAmount / USD_TO_VND) * 100) / 100;

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
                sku: item.product?.sku,
                price:
                  Math.round((item.product.price / USD_TO_VND) * 100) / 100, // convert vnd to usd
                currency: "USD",
                quantity: item.quantity,
              })),
              {
                name: "Voucher discount",
                sku: "9999",
                price: -Math.round((discountAmount / USD_TO_VND) * 100) / 100, // convert vnd to usd
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
            return res.json(link.href);
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

    let tableData = "";

    // update products' quantity and sold after purchasing
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          quantity: -item.quantity,
          sold: item.quantity,
        },
      });

      tableData += `<tr>
        <td>${item.product.name}</td>
        <td>${moneyFormatter.format(item.product.price)}</td>
        <td>${item.quantity}</td>
        <td>${moneyFormatter.format(item.product.price * item.quantity)}</td>
        </tr>`;
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

    await Notification.create({
      user: order.user,
      message: `Your order ${order.id} has been placed successfully.`,
    });

    sendNotification(
      order.id,
      req.user.email,
      req.user.fullName,
      tableData,
      moneyFormatter.format(order.shippingFee),
      moneyFormatter.format(order.totalPayment)
    );

    res.status(201).json(order);
  }
});

// @desc    Confirm payment
// @route   GET /api/orders/confirm?orderId=&totalPayment=&userId=?
// @access  Private (redirect)
const confirmPayment = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.query.orderId).populate({
    path: "orderItems",
    populate: {
      path: "product",
    },
  });

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
        let tableData = "";

        console.log(order.orderItems);
        // update products' quantity after purchasing
        for (const item of order.orderItems) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: {
              quantity: -item.quantity,
              sold: item.quantity,
            },
          });

          tableData += `<tr>
            <td>${item.product.name}</td>
            <td>${moneyFormatter.format(item.product.price)}</td>
            <td>${item.quantity}</td>
            <td>${moneyFormatter.format(
              item.product.price * item.quantity
            )}</td>
            </tr>`;
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

        const user = await User.findById(req.query.userId);

        await Notification.create({
          user: order.user,
          message: `Your order ${order.id} has been placed successfully.`,
        });

        sendNotification(
          order.id,
          user.email,
          user.fullName,
          tableData,
          moneyFormatter.format(order.shippingFee),
          moneyFormatter.format(order.totalPayment)
        );

        // this order become valid now
        order.isValid = true;
        await order.save();
        res.redirect("http://localhost:3000/result?success");
      }
    }
  );
});

// @desc    Cancel payment
// @route   GET /api/orders/cancel?orderId=
// @access  Private (redirect)
const cancelPayment = asyncHandler(async (req, res, next) => {
  await Order.findByIdAndDelete(req.query.orderId);
  res.redirect("http://localhost:3000/result?error");
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

  const order = await Order.findById(req.params.id).populate("user");
  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  if (
    order.status === "Canceled" ||
    order.status === "Completed" ||
    order.status === "Return/Refund"
  ) {
    res.status(403);
    throw new Error("Unable to update the order status.");
  } else {
    if (req.body.status === "Canceled") {
      if (order.paymentMethod === "Cash") {
        order.canceledAt = new Date().toISOString();
        order.status = req.body.status;

        await Notification.create({
          user: order.user,
          message: `Your order ${order.id} has been canceled.`,
        });

        sendMail({
          to: order.user.email,
          subject: "Order Upates",
          html: `<p>Your order ${order.id} has been canceled.</p>`,
        });
      } else if (order.paymentMethod === "Paypal") {
        order.returnAt = new Date().toISOString();
        order.status = "Return/Refund";

        await Notification.create({
          user: order.user,
          message: `Your order ${order.id} has been canceled and is being refunded.`,
        });

        sendMail({
          to: order.user.email,
          subject: "Order Upates",
          html: `<p>Your order ${order.id} has been canceled and is being refunded.</p>`,
        });
      }
    }
  }

  if (order.status === "To Pay" && req.body.status === "To Ship") {
    order.confirmedAt = new Date().toISOString();
    order.status = req.body.status;

    await Notification.create({
      user: order.user,
      message: `Your order ${order.id} has been confirmed and packed.`,
    });

    sendMail({
      to: order.user.email,
      subject: "Order Upates",
      html: `<p>Your order ${order.id} has been confirmed and packed.</p>`,
    });
  }

  if (order.status === "To Ship" && req.body.status === "To Receive") {
    order.shippedOutAt = new Date().toISOString();
    order.status = req.body.status;

    await Notification.create({
      user: order.user,
      message: `Your order ${order.id} has been shipped out.`,
    });

    sendMail({
      to: order.user.email,
      subject: "Order Upates",
      html: `<p>Your order ${order.id} has been shipped out.</p>`,
    });
  }

  if (order.status === "To Receive" && req.body.status === "Completed") {
    order.completedAt = new Date().toISOString();
    order.status = req.body.status;

    await Notification.create({
      user: order.user,
      message: `Your order ${order.id} has been delivered.`,
    });

    sendMail({
      to: order.user.email,
      subject: "Order Upates",
      html: `<p>Your order ${order.id} has been delivered.</p>`,
    });
  }

  await order.save();

  res.json(order);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (admin)
const viewOrders = asyncHandler(async (req, res, next) => {
  // const statuses = [
  //   "To Pay",
  //   "To Ship",
  //   "To Receive",
  //   "Completed",
  //   "Canceled",
  //   "Return/Refund",
  // ];
  // const index = Number(req.query.status);
  // if (index < statuses.length && index >= 0) {
  //   res.json(await Order.find({ status: statuses[index] }));
  // } else {
  //   res.json(await Order.find({}));
  // }
  res.json(
    await Order.find({ isValid: true })
      .populate([
        {
          path: "orderItems",
          populate: {
            path: "product",
          },
        },
        {
          path: "user",
        },
      ])
      .sort({
        createdAt: 1,
      })
  );
});

module.exports = {
  placeOrder,
  confirmPayment,
  cancelPayment,
  updateOrderStatus,
  viewOrders,
};
