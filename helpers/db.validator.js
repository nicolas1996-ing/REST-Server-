const Role = require("../models/role.model"); // module.exports = model("Role", RoleSchema);
const User = require("../models/user.model");

const roleValidator = async (role = "") => {
  // rol validate in bd
  const existRole = await Role.findOne({ role });
  if (!existRole) {
    // error capturado por el validador de esquemas: schemaValidator
    throw new Error("rol is no valid - bd");
  }
};

const existEmail = async (email = "") => {
  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new Error("email already exist");
  }
};

const existUserById = async (id = "") => {
  const userExist = await User.findById(id);
  if (!userExist) throw new Error("user by Id no exist in bd");
};

module.exports = {
  roleValidator,
  existEmail,
  existUserById
};
