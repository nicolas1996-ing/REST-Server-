const getUsers = async (req, res) => {
  // res.send("Hello World!"); // return sitio-web
  res.status(200).json({
    success: true,
    message: "hello world",
    method: "get",
  });
};

const createUser = async (req, res) => {
  const data = req.body;
  const { name, age } = req.body;
  res.status(201).json({
    success: true,
    message: "hello world",
    method: "post",
    code: "bad request",
    name,
    age,
    data,
  });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { limit = 0, page = 1 } = req.query; // valores por defecto 0,1 ( si no se envian)
  const { token } = req.headers;

  res.status(400).json({
    success: true,
    message: "hello world",
    method: "put",
    code: "bad request",
    params: { id },
    queryParams: { limit, page },
    headers: { token },
  });
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
  res.status(200).json({
    success: true,
    message: "hello world",
    method: "delete",
  });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  updateUserPartial,
  deleteUser,
};
