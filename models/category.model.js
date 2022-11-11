const { Schema, model } = require("mongoose");

const categroySheema = Schema({
  name: {
    type: String,
    require: [true, "name is mandatory"],
    unique: true,
  },
  state: {
    type: Boolean,
    default: true,
    require: [true, "state is mandatory"],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: [true, "created by Id is mandatory"],
  },
});

categroySheema.methods.toJSON = function () {
  const { __v, ...others } = this.toObject();
  return others;
};

module.exports = model("Caterory", categroySheema);
/* importación => const { Category } = require("../models");*/
