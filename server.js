"use strict";
const bodyParser = require("body-parser");
const express = require("express");
const { createServer } = require("http");
const serviceLocator = require("./app/lib/service_locator");
const httpContext = require("express-http-context");
const { BncContract } = require("./scripts/InteractiveBnc");
const { mainBNB } = require("./scripts/InteractiveBnc");
const { getEthContract } = require("./scripts/InteractiveWithoutHardhat");
const logger = serviceLocator.get("logger");
const config = require("./app/config/configs");
const Database = require("./app/config/Database");
const routesV1 = require("./app/router");

const server = express();
server.use(bodyParser.json());
server.use(httpContext.middleware);
const routerV1 = express.Router();
server.use(routerV1);
routesV1(routerV1, serviceLocator);
const httpServer = createServer(server);

const startServer = async () => {
  await Database._connect();
  process.on("uncaughtException", (err) => {
    logger.error("Caught global exception");
    logger.debug(err);
    // eslint-disable-next-line no-process-exit
    Number(config.app.coredump) ? process.abort() : process.exit(1);
  });

  process.on("unhandledRejection", (reason) => {
    logger.error("unhandled promise rejection");
    logger.debug(reason);
    // eslint-disable-next-line no-process-exit
    Number(config.app.coredump) ? process.abort() : process.exit(1);
  });

  logger.info("Start listening on server");
  httpServer.listen(3000, () => {
    logger.info(
      `${config.app.name} server is running on port: ${config.app.port}`
    );
  });
};
startServer();

async function interactiveScript() {
  try {
    const EthContract = await getEthContract();
    EthContract.on("AssetAdded", async (newProductId) => {
      try {
        console.log("Trigger Called");
        const result = await mainBNB(newProductId);
        console.log(result);
      } catch (err) {
        console.error("Error in /addProduct:", err);
        //res.status(500).json({ err: "Internal server error" });
      }
    });
  } catch (err) {
    console.error("error in creating interactive script", err);
  }
}
interactiveScript();
