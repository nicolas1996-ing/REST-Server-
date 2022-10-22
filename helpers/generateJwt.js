const jwt = require("jsonwebtoken");

const generateJwt = (uid = "", email = "") => {
  return new Promise((res, rej) => {
    const payload = {
      uid,
      email,
    };
    
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        err ? rej("can no generate token") : res(token);
      }
    );
  });
};

module.exports = {
  generateJwt,
};
