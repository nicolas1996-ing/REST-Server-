const { Router } = require("express");
const { search } = require("../controllers/searchs.controller");
const { validateJWT } = require("../middlewares");
const { schemaValidator } = require("../middlewares/schemaValidator");

const router = Router();

// .../api/v1/searchs/:collectionName/:term
router.get("/:collection/:term", [validateJWT, schemaValidator], search);
module.exports = router;
