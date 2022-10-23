const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/db");
const { errorHandler } = require("./middlewares/errorMiddleware");
const PORT = process.env.PORT || 5000;

connectDb();

const app = express();

// accepting body data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// api
app.use("/api/users", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
