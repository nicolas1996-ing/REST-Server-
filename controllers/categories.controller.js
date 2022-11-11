const { Category } = require("../models");

const getCategories = async (req, res) => {
  try {
    /* paginación ... */
    /* populate ... */
    const { limit = 0, page = 0 } = req.query;
    // const query = { state: false }; // solo categorias inactivas
    const query = { state: true }; // solo categorias activas
    const [total, categories] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query)
        .skip(Number(page))
        .limit(Number(limit))
        .populate({
          path: "createdBy",
          select: ["name", "role"],
        }),
    ]);

    // const categories = await Category.find({}).populate("createdBy");
    res.status(200).json({
      success: true,
      controller: "categories",
      categories,
      meta: {
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error get categories ...",
    });
  }
};

const getCategory = async (req, res) => {
  try {
    /* categoria existe (verificado con middleware) ... */
    const { id } = req.params;
    const category = await Category.findById(id).populate([
      {
        path: "createdBy",
        select: ["name", "role"],
      },
    ]);
    res.status(200).json({
      success: true,
      controller: "categories",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error get category ...",
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const name = req.body.name.toUpperCase();
    const categoryDb = await Category.findOne({ name });

    // verificar si categoria existe ...
    if (categoryDb) {
      return res.status(400).json({
        success: false,
        message: `category ${name} already exists in bd`,
      });
    }

    // data que quiero grabar ...
    const data = {
      name,
      createdBy: req.userAuth._id,
    };

    // guardar en bd ...
    const newCategory = new Category(data);
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "category has been created",
      newCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error create category ...",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

  
    // verificar si categoria existe ...
    const categoryDb = await Category.findOne({ name });
    if (categoryDb) {
      return res.status(400).json({
        success: false,
        message: `category ${name} already exists in bd`,
      });
    }
    /* solo actualizar nombre/estado ...*/
    const { _id, createdBy, ...validInfo } = req.body;
    const category = await Category.findByIdAndUpdate(id, validInfo, {
      new: true,
    });

    res.status(201).json({
      success: true,
      message: "category has been updated",
      category,
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error update category ...",
    });
  }
};
const deleteCategory = async (req, res) => {
  /*
    En este punto:
      - la categoria existe 
  */

  try {
    const { id } = req.params;
    /* cambiar el estado de la categoria */
    const categoryDb = await Category.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "status has been updated",
      categoryDb,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error delete category ...",
    });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
