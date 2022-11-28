const asyncHandler = require("express-async-handler");

function checkPermission(allowedRole) {
  return asyncHandler(async (req, res, next) => {
    if (req.user?.role === allowedRole) {
      next();
    } else {
      res.status(403);
      throw new Error("You don't have permission to access this resource.");
    }
  });
}

module.exports = checkPermission;
