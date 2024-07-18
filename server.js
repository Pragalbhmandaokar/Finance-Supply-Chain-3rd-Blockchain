"use strict";
const bodyParser = require("body-parser");
const express = require("express");
const { createServer } = require("http");
const serviceLocator = require("./app/lib/service_locator");
const cors = require("cors");
const httpContext = require("express-http-context");
const { getBncContract } = require("./blockchain/scripts/InteractiveBnc");
const { mainBNB } = require("./blockchain/scripts/InteractiveBnc");
const {
  getEthContract,
} = require("./blockchain/scripts/InteractiveWithoutHardhat");
const logger = serviceLocator.get("logger");
const config = require("./app/config/configs");
const Database = require("./app/config/Database");
const routesV1 = require("./app/router");

const server = express();
server.use(cors("*"));
server.use(bodyParser.json());
server.use(httpContext.middleware);
const routerV1 = express.Router();
server.use(routerV1);
routesV1(routerV1, serviceLocator);
const httpServer = createServer(server);

async function setupEventListeners() {
  try {
    const contract = await serviceLocator
      .get("invoiceChain")
      .getContract(
        "440ff6184ca2a5fa5d072d60bd2e3bc1b0ef2d2f9dbc50f6328a3f3e04ebcd8c"
      );
    console.log("Contract instance retrieved");

    contract.on("*", (event) => {
      console.log("Event detected:", event);
    });

    console.log("Event listener setup complete.");
  } catch (err) {
    console.error("error in creating interactive script", err);
  }
}

setupEventListeners()
  .then(() => console.log("Event listeners set up."))
  .catch(console.error);

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
