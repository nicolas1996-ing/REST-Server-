const { Router } = require("express");
const { check } = require("express-validator");
const {
  getUsers,
  updateUser,
  createUser,
  updateUserPartial,
  deleteUser,
} = require("../controllers/user.controller");
const {
  roleValidator,
  existEmail,
  existUserById,
} = require("../helpers/db.validator");
const { schemaValidator } = require("../middlewares/schemaValidator");
const router = Router();

router.get("/", getUsers);
router.post(
  "/",
  [
    check("name", "name is mandatory").not().isEmpty(),
    check("email", "email is no valid").isEmail(),
    check("password", "password should have min six characters").isLength({
      min: 6,
    }),

    // validaciones personalizadas ...
    // check("role", "rol no valid").isIn(["ADMIN_ROLE", "USER_ROLE"]), // validate in bd
    // check("role").custom((role = "") => roleValidator(role)), // es lo mismo que lo de abajo
    check("role").custom(roleValidator), // el rol pasa como argumento del callback
    check("email").custom(existEmail), // el email pasa como argumento del callback
    schemaValidator,
  ],
  createUser
);
router.put(
  "/:id",
  [
    check("id", "invalid Id").isMongoId(),
    check("id").custom(existUserById),
    check("role").custom(roleValidator), // el rol pasa como argumento del callback
    schemaValidator,
  ],
  updateUser
);
router.patch("/:id", updateUserPartial);
router.delete(
  "/:id",
  [
    check("id", "invalid Id").isMongoId(),
    check("id").custom(existUserById),
    schemaValidator,
  ],
  deleteUser
);

module.exports = router;
