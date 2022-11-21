const dbValidators = require("./db.validator");
const generateJwt = require("./generateJwt");
const googleValidator = require("./google.validator");
const uploadFileValidator = require("./upload-file.validator");

module.exports = {
  ...dbValidators,
  ...generateJwt,
  ...googleValidator,
  ...uploadFileValidator,
};
