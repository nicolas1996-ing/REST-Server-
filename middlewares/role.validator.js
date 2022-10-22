const verifyRole = (...roles) => {
  console.log(roles);
  return (req, res, next) => {
    const { userAuth } = req;
    if (!userAuth) {
      return res.status(500).json({
        success: false,
        message:
          "you are validating the user without validating the token first, please implement token middleware before userAdmin middleware",
      });
    }

    if (!roles.includes(userAuth.role)) {
      return res.status(401).json({
        success: false,
        message: `the service requires one of these roles: ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  verifyRole,
};
