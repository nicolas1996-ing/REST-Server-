const { Router } = require("express");
const { check } = require("express-validator");
const {
  uploadFile,
  getImgCollection,
  updateImgCollectionCloudinary,
} = require("../controllers/uploads.controller");
const { collectionAllowed } = require("../helpers");
const { validateFileUpload } = require("../middlewares");
const { schemaValidator } = require("../middlewares/schemaValidator");
const router = Router();

/* mostar imagen asociado a una entidad ( usuarios - productos ) */
router.get(
  "/:collection/:id",
  [
    check("id", "id should be mongoId").isMongoId(),
    check("collection").custom((c) =>
      collectionAllowed(c, ["users", "products"])
    ),
    schemaValidator,
  ],
  getImgCollection
);

/* subir cualquier tipo de archivo a bd */
router.post("/", [validateFileUpload], uploadFile);

/* actualizar img de una entidad */
router.patch(
  "/:collection/:id",
  [
    validateFileUpload,
    check("id", "id should be mongoId").isMongoId(),
    check("collection").custom((c) =>
      collectionAllowed(c, ["users", "products"])
    ),
    schemaValidator,
  ],
  updateImgCollectionCloudinary
);

module.exports = router;
