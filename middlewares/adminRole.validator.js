const { ROLES } = require("../models/shared.enums.models");

const verifyAdminRole = (req, res, next) => {
  try {
    const { userAuth } = req;
    if (!userAuth) {
      return res.status(500).json({
        success: false,
        message:
          "you are validating the user without validating the token first, please implement token middleware before userAdmin middleware",
      });
    }

    const { role } = userAuth;
    // console.log(role);

    if (role !== ROLES.ADMIN) {
      return res.status(401).json({
        success: true,
        message: "user is not admin",
      });
    }

    // here is admin_role
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "errro validating admin role - middleware",
      error,
    });
  }
};

module.exports = {
  verifyAdminRole,
};
