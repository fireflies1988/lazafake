const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const CartItem = require("../models/cartItemModel");
const Notification = require("../models/notificationModel");
const connectDb = require("../configs/db");
const dotenv = require("dotenv").config();

connectDb();

(async () => {

  console.log("success");
  process.exit();
})();
