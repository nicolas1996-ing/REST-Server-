const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");
const fileUpload = require("express-fileupload"); // aceptar archivos desde una petición http

class Server {
  constructor() {
    this.app = express();

    this.connectBd(); // connect bd
    this.middlewares();

    // paths
    this.paths = {
      users: "/api/v1/users",
      categories: "/api/v1/categories",
      products: "/api/v1/products",
      auth: "/api/v1/auth",
      searchs: "/api/v1/searchs",
      uploads: "/api/v1/uploads",
    };

    this.routes();
    this.port = process.env.PORT || 8080;
  }

  async connectBd() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json()); // config json format input
    this.app.use(express.static("public")); // localhost:port/ ( front-end )
    this.app.use(
      // carga de archivos
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth.route")); // login ...api/v1/auth
    this.app.use(this.paths.users, require("../routes/users.route")); // ...api/v1/users
    this.app.use(this.paths.categories, require("../routes/categories.route"));
    this.app.use(this.paths.products, require("../routes/products.route"));
    this.app.use(this.paths.searchs, require("../routes/searchs.route"));
    this.app.use(this.paths.uploads, require("../routes/uploads.route"));
  }

  // init server
  listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`);
    });
  }
}

module.exports = {
  Server,
};
