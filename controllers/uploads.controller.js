/* npm i express-fileupload */
const path = require("path");
const fs = require("fs");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL); // config

const { uploadFileHelper } = require("../helpers");
const { User, Product } = require("../models");

/*
  Almacenar archivos en la nube: cloudinary
  - https://cloudinary.com/console/c-920932d79d74e4e5bd39ff7e57c06a (naingenier16@gmail.com...) 
  - npm i cloudinary
  - https://cloudinary.com/console/c-920932d79d74e4e5bd39ff7e57c06a/media_library/folders/home
*/

getImgCollection = async (req, res) => {
  try {
    const { collection, id } = req.params;
    let model;

    switch (collection) {
      case "users":
        model = await User.findById(id);
        if (!model) {
          return res.status(400).json({
            success: false,
            message: `no exist user with id: ${id}`,
          });
        }
        break;
      case "products":
        model = await Product.findById(id);
        if (!model) {
          return res.status(400).json({
            success: false,
            message: `no exist product with id: ${id}`,
          });
        }
        break;
      default:
        return res
          .status(500)
          .json({ success: false, message: "no valid collection" });
    }

    if (model.img) {
      const pathImg = path.join(
        __dirname,
        "../uploads/",
        collection,
        model.img
      );
      // validar si ruta existe ...
      if (fs.existsSync(pathImg)) {
        // retornar un arhivo en la reponse...
        return res.status(200).sendFile(pathImg);
      }
    }

    const noImgPath = path.join(__dirname, "../uploads/no-image.jpg");
    res.status(400).sendFile(noImgPath);
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};

uploadFile = async (req, res) => {
  // en este punto ya se validó que se adjunte una file en el request ( middleware )

  try {
    const resp = await uploadFileHelper(req.files, undefined, "imgs");
    res.status(200).json({
      success: true,
      message: "file upload",
      localUrl: resp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

updateImgCollection = async (req, res) => {
  // en este punto ya se validó que se adjunte una file en el request ( middleware )
  const { id, collection } = req.params;

  /* validaciones */
  let model;
  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          success: false,
          message: `no exist user with id: ${id}`,
        });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          success: false,
          message: `no exist product with id: ${id}`,
        });
      }
      break;
    default:
      return res
        .status(500)
        .json({ success: false, message: "no valid collection" });
  }

  try {
    // toDo:  borrar imgs previas asociadas a la collection ...
    if (model.img) {
      // borrar img del servidor...
      const pathImg = path.join(
        __dirname,
        "../uploads/",
        collection,
        model.img
      ); // path de la img
      // validar si ruta existe ...
      if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg); // borrar archivo
      }
    }

    model.img = await uploadFileHelper(req.files, undefined, collection);
    model.save();

    res.status(200).json({
      success: true,
      message: "file upload",
      model,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error,
      file: req.files,
    });
  }
};

// cloudinary
updateImgCollectionCloudinary = async (req, res) => {
  // en este punto ya se validó que se adjunte una file en el request ( middleware )
  const { id, collection } = req.params;

  /* validaciones */
  let model;
  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          success: false,
          message: `no exist user with id: ${id}`,
        });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          success: false,
          message: `no exist product with id: ${id}`,
        });
      }
      break;
    default:
      return res
        .status(500)
        .json({ success: false, message: "no valid collection" });
  }

  try {
    // toDo:  borrar imgs previas asociadas a la collection ...
    if (model.img) {
      // borrar img del servidor...
      const idImgCloudinary = model.img.split("/").at(-1).split(".")[0];
      cloudinary.uploader.destroy(idImgCloudinary);
    }

    // cloudinary
    const { tempFilePath } = req.files.file_img;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    model.img = secure_url;
    await model.save();

    res.status(200).json({
      success: true,
      message: "file upload cloudinary",
      model,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error,
      file: req.files,
    });
  }
};

module.exports = {
  uploadFile,
  updateImgCollection,
  getImgCollection,
  updateImgCollectionCloudinary,
};
