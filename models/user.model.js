const { Schema, model } = require("mongoose");

const userSheema = Schema({
  name: {
    type: String,
    require: [true, "name is mandatory"],
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: [true, "password is mandatory"],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    require: true,
    enum: ["ADMIN_ROLE", "USER_ROLE"],
  },
  state: {
    type: Boolean,
    default: true,
  },
  createdByGoogle: {
    type: Boolean,
    default: false,
  },
});

// custom methods
userSheema.methods.toJSON = function () {
  const { password, __v, _id, ...others } = this.toObject();
  others.uid = _id;
  return others;
};

// moongose add 's' to model name: Users
module.exports = model("User", userSheema);
