"use strict";
const serviceLocator = require("../lib/service_locator");
const logger = serviceLocator.get("logger");

class Database {
  constructor() {
    this.mongoose = serviceLocator.get("mongoose");
  }

  async _connect() {
    return new Promise((resolve, reject) => {
      console.log("DB Connection Checking");
      this.mongoose.Promise = global.Promise;
      const dbURI = "mongodb://127.0.0.1:27017/FSCBlockchain";

      this.mongoose.connect(dbURI);

      const { connection } = this.mongoose;

      connection.on("connected", () => {
        logger.info("Database connection is successful");
        return resolve();
      });
      connection.on("error", (err) => {
        logger.info(`Database Connection Failed${err}`);
        return reject(err);
      });

      connection.on("disconnected", () =>
        logger.info("Database Connection Disconnected")
      );

      process.on("SIGINT", () => {
        connection.close();
        logger.info(
          "Database Connection closed due to NodeJs process termination"
        );

        // eslint-disable-next-line no-process-exit
        process.exit(0);
      });

      // initialize Model
      const fs = serviceLocator.get("fs");
      const path = serviceLocator.get("path");
      const modelsPath = path.resolve("./app/models");
      const files = fs.readdirSync(modelsPath);
      let filename = "";

      for (const file of files) {
        filename = file.split(".")[0];
        require(`${modelsPath}/${filename}`);
      }
    });
  }
  async _disConnect() {
    this.mongoose.disconnect();
  }
}

module.exports = new Database();
