const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const validateJWT = async (req, res, next) => {
  const token = req.header("x-token");
 
  // token exist ?
  if (!token) {
    return res.status(404).json({
      success: false,
      message: "no found JWT",
    });
  }

  try {
    // info associate to token 
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    // user exist ?
    const userAuth = await User.findById(payload.uid);
    if (!userAuth) {
      return res.status(404).json({
        success: false,
        message: "user no exist in bd",
      });
    }

    // valide if user is active
    if (!userAuth.state) {
      return res.status(401).json({
        success: false,
        message: "user is INACTIVE, can not delete registers",
      });
    }

    req.userAuth = userAuth;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "no valid JWT",
      error,
    });
  }
};

module.exports = {
  validateJWT,
};

// req.uid = payload.uid;
// req.email = payload.email;
