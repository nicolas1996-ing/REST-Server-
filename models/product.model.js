const { Schema, model } = require("mongoose");

const ProductSheema = Schema({
  name: {
    type: String,
    require: [true, "name is mandatory"],
    unique: true,
  },
  description: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  status: {
    type: Boolean,
    default: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Caterory",
    require: [true, "created by Id is mandatory"],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: [true, "created by Id is mandatory"],
  },
});

ProductSheema.methods.toJSON = function () {
  const { __v, ...others } = this.toObject();
  return others;
};

module.exports = model("Product", ProductSheema);
