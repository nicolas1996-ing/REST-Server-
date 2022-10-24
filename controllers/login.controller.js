const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const { generateJwt } = require("../helpers/generateJwt");
const { googleVerify } = require("../helpers/google.validator");

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

const googleSignIn = async (req, res) => {
  const { id_token } = req.body;
  try {
    const googleUser = await googleVerify(id_token);

    // verify if user exist in bd ...
    let user = await User.findOne({ email: googleUser.email });
    if (!user) {
      // create user ...
      const data = {
        name: googleUser.name,
        email: googleUser.email,
        password: "login-with-google",
        img: googleUser.picture,
        createdByGoogle: true,
      };

      user = new User(data);
      await user.save(); // save in bd
    }

    // if user is disabled ( deleted ) ...
    if (!user.state) {
      return res.status(401).json({
        success: false,
        message: "user is disabled (deleted) ",
      });
    }

    // generate jwt ...
    const token = await generateJwt(user._id, user.email);

    res.status(200).json({
      success: true,
      message: "all is good with google sign In",
      user,
      token
    });
  } catch (error) {
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
  googleSignIn,
};
