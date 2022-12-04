const { body } = require("express-validator");

exports.validate = (method) => {
  switch (method) {
    case "changePassword": {
      return [
        body("currentPassword", "Current password is required.").notEmpty(),
        body(
          "newPassword",
          "Password must be at least 6 characters long."
        ).isLength({
          min: 6,
        }),
        body("confirmNewPassword").custom((value, { req }) => {
          if (value !== req.body.newPassword) {
            throw new Error("Passwords do not match.");
          }
          return true;
        }),
      ];
    }

    case "register": {
      return [
        body("fullName")
          .trim()
          .notEmpty()
          .withMessage("Full name is required."),
        body("email").isEmail().withMessage("Invalid email address."),
        body(
          "password",
          "Password must be at least 6 characters long."
        ).isLength({
          min: 6,
        }),
        body("confirmPassword").custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error("Passwords do not match.");
          }
          return true;
        }),
      ];
    }

    case "updateMe": {
      return [
        body("fullName", "Full name is required.").optional().trim().notEmpty(),
        body("phoneNumber", "Invalid phone number.")
          .optional()
          .trim()
          .matches(/^\d{10}$/),
        body("gender").optional().isIn(["Male", "Female", "Other"]),
        body("dateOfBirth", "Invalid dateOfBirth value.")
          .optional()
          .isISO8601(),
      ];
    }

    case "addAddress": {
      return [
        body("fullName", "Full name is required.").trim().notEmpty(),
        body("phoneNumber")
          .trim()
          .matches(/^\d{10}$/)
          .withMessage("Invalid phone number."),
        body("province", "Province is required.").trim().notEmpty(),
        body("district", "District is required.").trim().notEmpty(),
        body("ward", "Ward is required.").trim().notEmpty(),
        body("address", "Address is required.").trim().notEmpty(),
        body("label").optional().isIn(["Work", "Home", "Other"]),
        body("isDefault").optional().isBoolean(),
      ];
    }

    case "updateAddress": {
      return [
        body("fullName", "Full name is required.").optional().trim().notEmpty(),
        body("phoneNumber")
          .optional()
          .trim()
          .isNumeric()
          .withMessage("Invalid phone number."),
        body("province", "Province is required.").optional().trim().notEmpty(),
        body("district", "District is required.").optional().trim().notEmpty(),
        body("ward", "Ward is required.").optional().trim().notEmpty(),
        body("address", "Address is required.").optional().trim().notEmpty(),
        body("label").optional().isIn(["Work", "Home", "Other"]),
        body("isDefault").optional().isBoolean(),
      ];
    }

    case "addCategory": {
      return [body("name", "Name is required.").trim().notEmpty()];
    }

    case "addProduct": {
      return [
        body("name", "Name is required.").trim().notEmpty(),
        body("sku", "SKU is required.").trim().notEmpty(),
        body("price").trim().isDecimal(),
        body("description", "Description is required.").trim().notEmpty(),
        body("quantity").trim().isNumeric({ no_symbols: true }),
      ];
    }

    case "updateProduct": {
      return [
        body("name", "Name is required.").optional().trim().notEmpty(),
        body("price").optional().trim().isDecimal(),
        body("description", "Description is required.")
          .optional()
          .trim()
          .notEmpty(),
        body("quantity").optional().trim().isNumeric({ no_symbols: true }),
      ];
    }

    case "createVoucher": {
      return [
        body("name", "Voucher name is required.").trim().notEmpty(),
        body("code", "Voucher code is required").trim().notEmpty(),
        body("type").isIn(["LazaFake", "Free Shipping"]),
        body("limited").isBoolean(),
        body("isPercentageDiscount").isBoolean(),
        body("discountAmount").trim().isDecimal(),
        body("minSpend").optional().trim().isDecimal(),
        body("expirationDate").optional().isDate(),
      ];
    }

    case "placeOrder": {
      return [
        body("shippingAddress", "Shipping address is required.")
          .trim()
          .notEmpty(),
        body("shippingFee").trim().isDecimal(),
        body("paymentMethod").isIn(["Cash", "Paypal"]),
        body("orderItems", "Order items can't be empty.").isArray({ min: 1 }),
      ];
    }

    case "updateOrderStatus": {
      return [
        body("status").isIn([
          "To Pay",
          "To Ship",
          "To Receive",
          "Completed",
          "Canceled",
          "Return/Refund",
        ]),
      ];
    }

    case "addToCart": {
      return [
        body("quantity", "Quantity is required.")
          .trim()
          .isNumeric({ no_symbols: true }),
      ];
    }

    case "createNotification": {
      return [body("message", "Message is required.").trim().notEmpty()];
    }
  }
};
