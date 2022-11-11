const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");

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
      searchs: "/api/v1/searchs"
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
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth.route")); // login ...api/v1/auth
    this.app.use(this.paths.users, require("../routes/users.route")); // ...api/v1/users
    this.app.use(this.paths.categories, require("../routes/categories.route"));
    this.app.use(this.paths.products, require("../routes/products.route"));
    this.app.use(this.paths.searchs, require("../routes/searchs.route"))
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
