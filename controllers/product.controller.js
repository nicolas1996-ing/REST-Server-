const { Product } = require("../models");

const getProducts = async (req, res) => {
  try {
    const { limit = 0, page = 0 } = req.query; // paginación
    const query = { status: true }; // solo productos activos
    const [total, products] = await Promise.all([
      Product.countDocuments(),
      Product.find(query)
        .skip(Number(page))
        .limit(Number(limit))
        .populate([
          {
            path: "category",
            select: ["name"],
          },
          {
            path: "createdBy",
            select: ["name", "role"],
          },
        ]),
    ]);

    res.status(200).json({
      succees: true,
      message: "products were found successfully",
      products,
      meta: {
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      succees: false,
      message: "error in getProducts",
      error,
    });
  }
};
const getProduct = async (req, res) => {
  try {
    // la existencia del produc. fue verificada en el router
    const { id } = req.params;
    const product = await Product.findById(id).populate([
      {
        path: "category",
        select: ["name"],
      },
      {
        path: "createdBy",
        select: ["name", "role"],
      },
    ]);

    res.status(200).json({
      succees: true,
      message: "product found",
      product,
    });
  } catch (error) {
    res.status(500).json({
      succees: false,
      message: "error in getProduct",
      error,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const name = req.body.name.toUpperCase();
    // guardar en bd...
    const data = {
      ...req.body,
      name,
      createdBy: req.userAuth._id,
    };

    const { status, ...body } = data;
    const newProduct = new Product(body); // instancia
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "product has been created",
      newProduct,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      succees: false,
      message: "error in createdProduct",
      error,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // props que se pueden actualizar ...
    const { _id, createdBy, status, ...validInfo } = req.body;

    if (validInfo.name) validInfo.name = validInfo.name.toUpperCase();

    const product = await Product.findByIdAndUpdate(id, validInfo, {
      new: true,
    });

    res.status(201).json({
      succees: true,
      message: "product has been updted",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error in updateProduct ",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    // existencia del producto validad en la ruta
    const { id } = req.params;
    const productDb = await Product.findByIdAndUpdate(
      id,
      { status: false, available: false },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "status has been updated",
      productDb,
    });
  } catch (error) {
    res.status(500).json({
      succees: false,
      message: "error in deleteProduct",
      error,
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
