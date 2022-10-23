const { body } = require("express-validator/check");

exports.validate = (method) => {
  switch (method) {
    case "changePassword": {
      return [
        body("currentPassword", "Current password is required.")
          .not()
          .isEmpty(),
        body(
          "newPassword",
          "Password must be at least 6 characters long."
        ).isLength({
          min: 6,
        }),
        body(
          "confirmNewPassword",
          "Password must be at least 6 characters long."
        ).isLength({
          min: 6,
        }),
      ];
    }

    case "register": {
      return [
        body("fullName", "Full name is required.").not().isEmpty(),
        body("email", "Invalid email.").isEmail(),
        body(
          "password",
          "Password must be at least 6 characters long."
        ).isLength({
          min: 6,
        }),
        body(
          "confirmPassword",
          "Password must be at least 6 characters long."
        ).isLength({
          min: 6,
        }),
      ];
    }
  }
};
