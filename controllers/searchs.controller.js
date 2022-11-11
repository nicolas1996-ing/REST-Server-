const { isValidObjectId } = require("mongoose");
const { User, Product, Category } = require("../models");

const allowedCollections = ["users", "categories", "products", "roles"];

const validateTerm = (term, res) => {
  const regexValidator = /^\w*$/g;
  if (!term.match(regexValidator)) {
    return res.status(500).json({
      success: false,
      message: "invalid term",
    });
  }
};
const seachUsers = async (term, res) => {
  const isMongoId = isValidObjectId(term);

  if (isMongoId) {
    const user = await User.findById(term);
    return res.status(200).json({
      success: true,
      results: user ? [user] : [],
    });
  }

  validateTerm(term, res);
  // termino es: name/email
  const regex = new RegExp(term, "i");

  /* 
  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ state: true }],
  });
  */

  const [total, users] = await Promise.all([
    User.countDocuments({
      $or: [{ name: regex }, { email: regex }],
      $and: [{ state: true }],
    }),
    User.find({
      $or: [{ name: regex }, { email: regex }],
      $and: [{ state: true }],
    }),
  ]);

  res.status(200).json({
    success: true,
    results: users ? users : [],
    total,
  });
};

/* categories => busqueda por: name */
const seachCategories = async (term, res) => {
  const isMongoId = isValidObjectId(term);

  if (isMongoId) {
    const category = await Category.findById(term);
    return res.status(200).json({
      success: true,
      results: category ? [category] : [],
    });
  }

  validateTerm(term, res);
  const regex = new RegExp(term, "i");
  const [total, categories] = await Promise.all([
    Product.countDocuments({
      $or: [{ name: regex }],
      $and: [{ state: true }],
    }),
    Product.find({
      $or: [{ name: regex }],
      $and: [{ state: true }],
    }).populate({
      path: "createdBy",
      select: ["name", "role"],
    }),
  ]);

  res.status(200).json({
    success: true,
    results: categories ? categories : [],
    total,
  });
};

/* products => busqueda por: name, price, description */
const seachProducts = async (term, res) => {
  const isMongoId = isValidObjectId(term);

  if (isMongoId) {
    const product = await Product.findById(term);
    return res.status(200).json({
      success: true,
      results: product ? [product] : [],
    });
  }

  validateTerm(term, res);
  // termino es: name/price/description
  const regex = new RegExp(term, "i");

  const [total, products] = await Promise.all([
    Product.countDocuments({
      $or: [{ name: regex }, { description: regex }],
      $and: [{ state: true }],
    }),
    Product.find({
      $or: [{ name: regex }, { description: regex }],
      $and: [{ state: true }],
    }).populate([
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
    success: true,
    results: products ? products : [],
    total,
  });
};

const search = async (req, res) => {
  const { collection, term } = req.params;

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      success: false,
      message: `collections allowed are: ${allowedCollections}`,
    });
  }

  switch (collection) {
    case allowedCollections[0]:
      seachUsers(term, res);
      break;
    case allowedCollections[1]:
      seachCategories(term, res);
      break;
    case allowedCollections[2]:
      seachProducts(term, res);
      break;
    case allowedCollections[3]:
      break;

    default:
      res.status(500).json({
        success: false,
        message: "error in name collection",
      });
      break;
  }

  // res.status(200).json({
  //   success: true,
  //   message: "route searchs",
  //   collection,
  //   term,
  // });
};
module.exports = {
  search,
};
