const asyncHandler = require("express-async-handler");

function checkPermission(allowedRoles) {
  return asyncHandler(async (req, res, next) => {
    if (allowedRoles.includes(req?.user?.role)) {
      next();
    } else {
      res.status(403);
      throw new Error("You don't have permission to access this resource.");
    }
  });
}

module.exports = checkPermission;
