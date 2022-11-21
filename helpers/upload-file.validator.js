const path = require("path");
const { v4: uuidv4 } = require("uuid");

const uploadFileHelper = (
  files,
  extensionsValid = ["png", "jpg", "jpeg", "gif"],
  folderName = ""
) => {
  return new Promise((resolve, reject) => {
    /* body >> form-data >> {key: 'file', value: fileFromPc} */
    const { file_img: file } = files; // img
    const extensionFile = file.name.split(".").at(-1);
    const nameFile = file.name.split(".").slice(0, -1).join("");

    console.log(extensionFile);
    console.log(nameFile);

    if (!extensionsValid.includes(extensionFile)) {
      console.log("extension no allowed");
      reject(
        `Ext no allowed: ${extensionFile}. Allowd ext: ${extensionsValid}`
      );
    }

    /* renombrar img ... */
    const endName = uuidv4().concat(".").concat(extensionFile);
    const uploadPath = path.join(__dirname, `../uploads/`, folderName, endName);

    file.mv(uploadPath, function (err) {
      if (err) {
        reject(err);
      }

      resolve(endName);
    });
  });
};

module.exports = {
  uploadFileHelper,
};
