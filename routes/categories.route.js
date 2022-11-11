const { Router } = require("express");
const { check } = require("express-validator");
const { schemaValidator } = require("../middlewares/schemaValidator");
const { verifyAdminRole, validateJWT, verifyRole } = require("../middlewares"); // busca el archivo index.js
const { ROLES } = require("../models/shared.enums.models");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories.controller");
const { existCategoryById, categoryIsDisabled } = require("../helpers/db.validator");

const router = Router();

router.get(
  "/",
  [
    validateJWT,
    verifyRole(ROLES.ADMIN, ROLES.USER), // must be ADMIN or USER
    schemaValidator,
  ],
  getCategories
);

router.get(
  "/:id",
  [
    validateJWT,
    verifyRole(ROLES.ADMIN, ROLES.USER), // must be ADMIN or USER
    check("id", "invalid Id, is not mongoId").isMongoId(),
    check("id").custom(existCategoryById), // personalizado, verificar que id categoria exista
    schemaValidator,
  ],
  getCategory
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "name is mandatory").not().isEmpty(),
    schemaValidator,
  ],
  createCategory
);

router.patch(
  "/:id",
  [
    validateJWT,
    verifyRole(ROLES.ADMIN), // must be ADMIN or USER
    check("id", "invalid Id, is not mongoId").isMongoId(),
    check("id").custom(existCategoryById), // envia el id como parametro del callback
    check("name", "category name is mandatory").not().isEmpty(),
    check("id").custom(categoryIsDisabled),
    schemaValidator,
  ],
  updateCategory
);

// falta
router.delete(
  "/:id",
  [
    validateJWT,
    verifyRole(ROLES.ADMIN), // must be ADMIN
    check("id", "invalid Id, is not mongoId").isMongoId(),
    check("id").custom(existCategoryById),
    check("id").custom(categoryIsDisabled),
    schemaValidator,
  ],
  deleteCategory
);

module.exports = router;
