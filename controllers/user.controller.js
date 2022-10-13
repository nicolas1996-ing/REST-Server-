const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");

const getUsers = async (req, res) => {
  // res.send("Hello World!"); // return sitio-web
  const { limit = 0, page = 1 } = req.query;

  try {
    // avoid delete user permanently
    // users being saved in bd with status=false
    const condition = { state: true }; // only active users
    // const condition = {}; // all of active users

    /*
    // paginator ...
    // solution 1.
    const users = await User.find(condition)
      .skip(Number(page || 0))
      .limit(Number(limit || 0));

    // counter ...
    const total = await User.countDocuments(condition);
    */

    // solution 2. better time response ...
    const [total, users] = await Promise.all([
      User.countDocuments(condition),
      User.find(condition)
        .skip(Number(page || 0))
        .limit(Number(limit || 0)),
    ]);

    res.status(200).json({
      success: true,
      message: "users in bd",
      method: "get",
      users,
      meta: {
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "user no found",
      entity: "GET -> User",
      error,
    });
  }
};

const createUser = async (req, res) => {
  const { google, ...validInfo } = req.body;

  try {
    // el email ya está verificado en la ruta ...

    // encrypt/hash password
    const user = new User({ ...validInfo });
    const salt = bcryptjs.genSaltSync(10);
    user.password = bcryptjs.hashSync(validInfo.password); // hash
    await user.save();

    res.status(201).json({
      success: true,
      message: "user has been created",
      method: "post",
      validInfo,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "user can not create",
      entity: "POST -> User",
      error,
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { limit = 0, page = 1 } = req.query; // valores por defecto 0,1 ( si no se envian)
  const { token } = req.headers;

  // props que no se pueden actualizar
  const { password, google, email, _id, ...validInfo } = req.body;

  // validaciones ...
  if (password) {
    // user wants to update password...

    // encript password
    const salt = bcryptjs.genSaltSync(10);
    const passwordHash = bcryptjs.hashSync(password);
  }

  try {
    // update user ... ( without password )
    // only update info in validInfo
    const user = await User.findByIdAndUpdate(id, validInfo);
    res.status(201).json({
      success: true,
      message: "user has been updated",
      method: "put",
      params: { id },
      queryParams: { limit, page },
      headers: { token },
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "user can not udpate",
      entity: "PUT -> User",
      error,
    });
  }
};

const updateUserPartial = async (req, res) => {
  res.status(400).json({
    success: true,
    message: "hello world",
    method: "put",
    code: "bad request",
  });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // await User.findByIdAndDelete(id); // permanente
    const user = await User.findByIdAndUpdate(id, { state: false });

    res.status(203).json({
      success: true,
      message: "user has been archived",
      method: "delete",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "user can not udpate",
      entity: "PUT -> User",
      error,
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  updateUserPartial,
  deleteUser,
};
