const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const { generateJwt } = require("../helpers/generateJwt");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // verify: email exist ?
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user or password incorrect",
        entity: "POST -> Login",
      });
    }
    // verify: user is active ?
    if (!user.state) {
      return res.status(400).json({
        success: false,
        message: "user is inactive",
        entity: "POST -> Login",
      });
    }
    // verify: password valid ?
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "password incorrect",
        entity: "POST -> Login",
      });
    }

    // user valid. Generate JWT ...
    /*
      {
        _id: new ObjectId("634ecd2c59666489e9f065fd"),
        name: 'admin',
        email: 'admin@gmail.com',
        password: '$2a$10$wSc0QODkEPu8ZolkaqxSCOoxbWTVq6j5mAugLAP6.FjYsVyPEDlbO',
        role: 'ADMIN_ROLE',
        state: true,
        createdByGoogle: false,
        __v: 0
      }
    */
    const token = await generateJwt(user._id, user.email);

    res.json({
      success: true,
      login: "ok",
      loginWith: {
        email,
        password,
      },
      userLogged: user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error in login",
      entity: "POST -> Login",
      error,
    });
  }
};

module.exports = {
  login,
};
