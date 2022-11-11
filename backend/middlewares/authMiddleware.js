const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const auth = asyncHandler(async (req, res, next) => {
  if (req.headers?.authorization?.startsWith("Bearer")) {
    try {
      // get access token
      accessToken = req.headers.authorization.split(" ")[1];

      // verify access token
      const decoded = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_TOKEN_SECRET
      );
      console.log(decoded);

      // get user data
      req.user = await User.findById(
        decoded.id,
        "-passwordHash -refreshTokenHash -cartItems"
      );

      next();
    } catch (err) {
      res.status(401).json(err);
    }
  } else {
    res.status(401);
    throw new Error("Access token is required.");
  }
});

module.exports = { auth };
