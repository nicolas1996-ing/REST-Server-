const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");

class Server {
  constructor() {
    this.app = express();

    this.connectBd(); // connect bd
    this.middlewares();

    // paths
    this.usersPath = "/api/v1/users";
    this.authPath = "/api/v1/auth"; // login
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
    this.app.use(this.authPath, require("../routes/auth.route")); // login ...api/v1/auth
    this.app.use(this.usersPath, require("../routes/users.route")); // ...api/v1/users
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
