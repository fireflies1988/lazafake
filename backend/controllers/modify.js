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
  

  console.log("success");
  process.exit();
})();
