const { validationResult } = require("express-validator");

const schemaValidator = (req, res, next) => {
  // errors - express validator - middleware route - check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "there are errors",
      errors,
    });
  }
  next();
};

module.exports = {
  schemaValidator,
};
