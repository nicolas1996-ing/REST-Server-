const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignIn } = require("../controllers/login.controller");
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

router.post(
  "/google",
  [
    check("id_token", "token google is needed").not().isEmpty(),
    schemaValidator,
  ],
  googleSignIn
);

module.exports = router;
