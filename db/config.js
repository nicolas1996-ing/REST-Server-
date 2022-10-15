require("dotenv").config();

const mongoose = require("mongoose");
const URL_BD = process.env.MONGODB_CNN;

const dbConnection = async () => {
  try {
    await mongoose.connect(URL_BD, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("bd online !!!");
  } catch (error) {
    console.log(error);
    throw new Error("error in bd connection");
  }
};

module.exports = {
  dbConnection,
};
