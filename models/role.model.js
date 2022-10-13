const { Schema, model } = require("mongoose");

const RoleSchema = Schema({
  role: {
    type: String,
    require: [true, "role is mandatory"],
  },
});

// moongose add 's' to model name: Roles 
module.exports = model("Role", RoleSchema);
