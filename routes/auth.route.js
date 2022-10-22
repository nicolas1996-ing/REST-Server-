const { Router } = require("express");
const { check } = require("express-validator");
const { login } = require("../controllers/login.controller");
const { schemaValidator } = require("../middlewares/schemaValidator");

const router = Router();

// .../api/auth/login
router.post(
  "/login",
  [
    check("email", "email is mandatory").isEmail(),
    check("password", "password is mandatory").not().isEmpty(),
    schemaValidator,
  ],
  login
);

module.exports = router;
