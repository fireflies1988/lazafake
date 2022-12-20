const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const CartItem = require("../models/cartItemModel");
const Notification = require("../models/notificationModel");
const connectDb = require("../configs/db");
const Address = require("../models/addressModel");
const dotenv = require("dotenv").config();
const Receipt = require("../models/receiptModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

connectDb();

(async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const notification = await new Notification({
      user: "6388e4a0ce4417aed3c49909",
      message: "test",
    }).save({ session });

    console.log(notification);

    // await Notification.findByIdAndDelete("63a1fdc90025661fe8ae4f0f", {
    //   session,
    // });

    // await CartItem.deleteMany({}, { session });

    throw new Error("hello");
    console.log("oke");
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
  } finally {
    await session.endSession();
  }

  console.log("success");
  process.exit();
})();
