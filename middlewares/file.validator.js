/* validar que se adjunten los archivos */

/*
    req.body
    req.params
    req.query
    req.files // subida de archivos
    req.headers('x-token')
*/

const validateFileUpload = async (req, res, next) => {
  if (
    !req.files ||
    Object.keys(req.files).length === 0 ||
    !req.files.file_img
  ) {
    return res.status(400).json({
      success: false,
      message: "No files were uploaded. No adjunt files",
    });
  }

  next();
};

module.exports = { validateFileUpload };
