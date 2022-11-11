const { Router } = require("express");
const { check } = require("express-validator");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const {
  existCategoryById,
  categoryIsDisabled,
  existUserById,
  userIsActive,
  existProductById,
  existProductByName,
} = require("../helpers/db.validator");
const { validateJWT, verifyRole } = require("../middlewares");
const { schemaValidator } = require("../middlewares/schemaValidator");
const { ROLES } = require("../models/shared.enums.models");

const router = Router();

router.get("/", [validateJWT], getProducts);

router.get(
  "/:id",
  [
    validateJWT,
    verifyRole(ROLES.ADMIN, ROLES.USER), // must be ADMIN or USER
    check("id", "invalid Id, is not mongoId").isMongoId(),
    check("id").custom(existProductById),
    schemaValidator,
  ],
  getProduct
);

router.post(
  "/",
  [
    validateJWT,
    verifyRole(ROLES.ADMIN),
    check("name", "name is mandatory").not().isEmpty(),
    check("name").custom(existProductByName),
    check("category", "category id is mandatory").not().isEmpty(),
    check("category").custom(existCategoryById), // existe la category ?
    check("category").custom(categoryIsDisabled), // la category esta activa
    schemaValidator,
  ],
  createProduct
);

router.patch(
  "/:id",
  [
    validateJWT,
    verifyRole(ROLES.ADMIN),
    check("name").custom(existProductByName),
    check("id", "invalid Id, is not mongoId").isMongoId(),
    check("id").custom(existProductById),
    schemaValidator,
  ],
  updateProduct
);

router.delete(
  "/:id",
  [
    validateJWT,
    verifyRole(ROLES.ADMIN),
    check("id", "invalid Id, is not mongoId").isMongoId(),
    check("id").custom(existProductById),
    schemaValidator,
  ],
  deleteProduct
);

module.exports = router;
