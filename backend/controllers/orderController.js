const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const paypal = require("../configs/paypal");
const Address = require("../models/addressModel");
const CartItem = require("../models/cartItemModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Voucher = require("../models/voucherModel");
const {
  checkVoucherConditions,
  checkAddressConditions,
  checkCartItem,
  calculateDiscount,
  convertVndToUsd,
} = require("../helpers/orderHelper");
const Notification = require("../models/notificationModel");
const { sendMail } = require("../services/mailService");
const User = require("../models/userModel");
const Receipt = require("../models/receiptModel");

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
  sendMail(
    {
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
    },
    (err, info) => {
      if (err) {
        console.log(err);
      }
    }
  );
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

  const {
    user,
    totalPayment,
    status,
    currency,
    isValid,
    orderItems, // cartItems: { cartItemId, discount }
    shippingAddress,
    ...fields
  } = req.body;

  // check shipping address
  await checkAddressConditions(res, shippingAddress, req.user.id);

  let tempTotalPayment = Number(fields.shippingFee);
  let tempOrderItems = []; // for later use (payment)

  for (let item of orderItems) {
    const cartItem = await CartItem.findById(item.cartItemId).populate(
      "product"
    );
    tempOrderItems.push({ cartItem, discount: item.discount });

    // check if cartItem is valid
    checkCartItem(res, cartItem, req.user.id);

    tempTotalPayment +=
      cartItem.quantity * (cartItem.product.price - item.discount);
  }

  // check applied vouchers
  let discountAmount = 0;
  if (fields?.vouchers) {
    const voucherTypes = new Set();
    for (const voucherId of fields.vouchers) {
      const voucher = await Voucher.findById(voucherId);

      checkVoucherConditions(res, voucher, req.user.id, tempTotalPayment);

      // if everything is okay, calculate discount amount
      if (voucherTypes.has(voucher.type)) {
        res.status(422);
        throw new Error("You can't use the same two vouchers for one order.");
      }
      voucherTypes.add(voucher.type);

      // calculate discount
      discountAmount += calculateDiscount(voucher, tempTotalPayment);
    }

    tempTotalPayment -= discountAmount;
  }

  // payment
  if (fields.paymentMethod === "Paypal") {
    const order = await Order.create({
      ...fields,
      user: req.user.id,
      shippingAddress: await Address.findById(shippingAddress),
      orderItems: tempOrderItems.map((o) => ({
        product: o.cartItem.product._id,
        quantity: o.cartItem.quantity,
        price: o.cartItem.product.price,
        discount: o.discount,
      })),
      totalPayment: tempTotalPayment,
      isValid: false,
    });

    // convert vnd to usd (paypal accepts usd only)
    console.log(tempOrderItems);
    let totalPaymentInUSD = (
      tempOrderItems.reduce(
        (acc, cur) =>
          acc +
          convertVndToUsd(cur.cartItem.product.price - cur.discount) *
            cur.cartItem.quantity,
        0
      ) - convertVndToUsd(discountAmount)
    ).toFixed(2);

    var create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `http://localhost:5000/api/orders/confirm?orderId=${order.id}&totalPayment=${totalPaymentInUSD}&userId=${req.user.id}`,
        cancel_url: `http://localhost:5000/api/orders/cancel?orderId=${order.id}`,
      },
      transactions: [
        {
          item_list: {
            items: [
              ...tempOrderItems.map((item) => ({
                name: item.cartItem.product.name,
                sku: "1111",
                price: convertVndToUsd(
                  item.cartItem.product.price - item.discount
                ),
                currency: "USD",
                quantity: item.cartItem.quantity,
              })),
              {
                name: "Voucher discount",
                sku: "9999",
                price: -convertVndToUsd(discountAmount),
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: totalPaymentInUSD,
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
      shippingAddress: await Address.findById(shippingAddress),
      orderItems: tempOrderItems.map((o) => ({
        product: o.cartItem.product._id,
        quantity: o.cartItem.quantity,
        price: o.cartItem.product.price,
        discount: o.discount,
      })),
      totalPayment: tempTotalPayment,
    });

    let tableData = "";

    // extract products' quantity after purchasing
    for (const item of tempOrderItems) {
      await Product.findByIdAndUpdate(item.cartItem.product._id, {
        $inc: {
          quantity: -item.cartItem.quantity,
        },
      });

      tableData += `<tr>
        <td>${item.cartItem.product.name}</td>
        <td>${moneyFormatter.format(
          item.cartItem.product.price - item.discount
        )}</td>
        <td>${item.cartItem.quantity}</td>
        <td>${moneyFormatter.format(
          (item.cartItem.product.price - item.discount) * item.cartItem.quantity
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

        // update products' quantity after purchasing
        for (const item of order.orderItems) {
          await Product.findByIdAndUpdate(item.product._id, {
            $inc: {
              quantity: -item.quantity,
            },
          });

          tableData += `<tr>
            <td>${item.product.name}</td>
            <td>${moneyFormatter.format(item.price - item.discount)}</td>
            <td>${item.quantity}</td>
            <td>${moneyFormatter.format(
              (item.price - item.discount) * item.quantity
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

        sendMail(
          {
            to: order.user.email,
            subject: "Order Updates",
            html: `<p>Your order ${order.id} has been canceled.</p>`,
          },
          (err, info) => {
            if (err) {
              console.log(err);
            }
          }
        );
      } else if (order.paymentMethod === "Paypal") {
        order.returnAt = new Date().toISOString();
        order.status = "Return/Refund";

        await Notification.create({
          user: order.user,
          message: `Your order ${order.id} has been canceled and is being refunded.`,
        });

        sendMail(
          {
            to: order.user.email,
            subject: "Order Updates",
            html: `<p>Your order ${order.id} has been canceled and is being refunded.</p>`,
          },
          (err, info) => {
            if (err) {
              console.log(err);
            }
          }
        );
      }

      // restore products' quantity after canceling or returning
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: {
            quantity: item.quantity,
          },
        });
      }
    }
  }

  if (order.status === "To Pay" && req.body.status === "To Ship") {
    if (!req.body.shipper) {
      res.status(400);
      throw new Error("Please choose a shipper for this order.");
    }

    order.confirmedAt = new Date().toISOString();
    order.status = req.body.status;
    order.shipper = req.body.shipper;

    await Notification.create({
      user: order.user,
      message: `Your order ${order.id} has been confirmed and packed.`,
    });

    sendMail(
      {
        to: order.user.email,
        subject: "Order Updates",
        html: `<p>Your order ${order.id} has been confirmed and packed.</p>`,
      },
      (err, info) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  if (order.status === "To Ship" && req.body.status === "To Receive") {
    order.shippedOutAt = new Date().toISOString();
    order.status = req.body.status;

    await Notification.create({
      user: order.user,
      message: `Your order ${order.id} has been shipped out.`,
    });

    sendMail(
      {
        to: order.user.email,
        subject: "Order Updates",
        html: `<p>Your order ${order.id} has been shipped out.</p>`,
      },
      (err, info) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  if (order.status === "To Receive" && req.body.status === "Completed") {
    order.completedAt = new Date().toISOString();
    order.status = req.body.status;

    await Notification.create({
      user: order.user,
      message: `Your order ${order.id} has been delivered.`,
    });

    // update products' sold and avgImportPrice after successfully delivery
    for (const orderItem of order.orderItems) {
      // find all import batches that contains this product
      const receipts = await Receipt.find({
        "products.product": orderItem.product,
      });

      // calculate avgImportPrice at that time
      let totalImportPrice = 0;
      let remain = orderItem.quantity;

      for (const receipt of receipts) {
        // get product details in that receipt
        const productInReceipt = receipt.products.find(
          (p) => p.product.toString() === orderItem.product.toString()
        );

        // check if this import batch is still in use
        if (productInReceipt.sold === productInReceipt.quantity) {
          continue;
        }

        if (remain + productInReceipt.sold <= productInReceipt.quantity) {
          totalImportPrice += productInReceipt.price * remain;

          // update receipt's sold field
          // You must include the array field as part of the query document.
          await Receipt.updateOne(
            {
              _id: receipt._id,
              "products.product": orderItem.product,
            },
            {
              $inc: {
                "products.$.sold": remain,
              },
            }
          );

          // done
          break;
        } else {
          remain -= productInReceipt.quantity - productInReceipt.sold;
          totalImportPrice +=
            (productInReceipt.quantity - productInReceipt.sold) *
            productInReceipt.price;

          await Receipt.updateOne(
            {
              _id: receipt._id,
              "products.product": orderItem.product,
            },
            {
              $set: {
                "products.$.sold": productInReceipt.quantity,
              },
            }
          );
        }
      }

      let avgImportPrice = Math.round(totalImportPrice / orderItem.quantity);
      // update orderItem's avgImportPrice
      await Order.updateOne(
        {
          _id: order._id,
          "orderItems.product": orderItem.product,
        },
        {
          $set: {
            "orderItems.$.avgImportPrice": avgImportPrice,
          },
        }
      );

      // update product's sold field
      await Product.findByIdAndUpdate(orderItem.product, {
        $inc: {
          sold: orderItem.quantity,
        },
      });
    }

    sendMail(
      {
        to: order.user.email,
        subject: "Order Updates",
        html: `<p>Your order ${order.id} has been delivered.</p>`,
      },
      (err, info) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }

  await order.save();

  res.json(
    await Order.findById(order.id).populate([
      {
        path: "orderItems",
        populate: {
          path: "product",
        },
      },
      {
        path: "user",
      },
      {
        path: "shipper",
      }
    ])
  );
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (admin, spadmin, shipper)
const viewOrders = asyncHandler(async (req, res, next) => {
  let orders = await Order.find({ isValid: true }).populate([
    {
      path: "orderItems",
      populate: {
        path: "product",
      },
    },
    {
      path: "user",
    },
    {
      path: "shipper",
    },
  ]);

  if (req.user.role === "shipper") {
    orders = orders.filter((o) => o?.shipper?._id.toString() === req.user?.id);
  }

  res.json(orders);
});

module.exports = {
  placeOrder,
  confirmPayment,
  cancelPayment,
  updateOrderStatus,
  viewOrders,
};
