const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./configs/db");
const { errorHandler } = require("./middlewares/errorMiddleware");
const PORT = process.env.PORT || 5000;
const cors = require("cors");

connectDb();

const app = express();

app.use(cors());

// accepting body data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// api
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/addresses", require("./routes/addressRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/vouchers", require("./routes/voucherRoutes"));

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
