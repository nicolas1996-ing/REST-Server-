const adminRoleValidator = require("../middlewares/adminRole.validator");
const jsonWebTokenValidator = require("../middlewares/jsonWebToken.validator");
const roleValidator = require("../middlewares/role.validator");
const validateFileUpload = require("../middlewares/file.validator");

module.exports = {
  ...adminRoleValidator, // todas las importaciones asociadas a esta ruta
  ...jsonWebTokenValidator,
  ...roleValidator,
  ...validateFileUpload,
};
