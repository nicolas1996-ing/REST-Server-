const { Category, Product } = require("../models");
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
  if (!userExist) throw new Error("user by Id no exists in bd");
};

const userIsActive = async (id = "") => {
  const userExist = await User.findById(id);
  if (!userExist || !userExist.state) throw new Error("user is inactive");
};

const existProductById = async (id = "") => {
  const existProduct = await Product.findById(id);
  if (!existProduct) throw new Error("product by id no exists in bd");
};

const existProductByName = async (name = "") => {
  const existProduct = await Product.findOne({ name });
  if (existProduct) throw new Error(`product ${name} is already exits in bd`);
};

const existCategoryById = async (id = "") => {
  const existCategory = await Category.findById(id);
  if (!existCategory) throw new Error("category by id no exists in bd");
};

const categoryIsDisabled = async (id = "") => {
  const existCategory = await Category.findById(id);
  if (existCategory && !existCategory.state)
    throw new Error("category is disabled");
};

module.exports = {
  roleValidator,
  existEmail,
  existUserById,
  existCategoryById,
  categoryIsDisabled,
  userIsActive,
  existProductById,
  existProductByName,
};
