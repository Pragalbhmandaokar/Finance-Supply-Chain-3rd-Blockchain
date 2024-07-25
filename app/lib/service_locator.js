"use strict";
const awilix = require("awilix");
const configs = require("../config/configs");
const logger = require("./logger").create(configs.application_logging);
const { Gateway, Wallets } = require("fabric-network");
const { ethers } = require("ethers");

function ServiceLocator() {
  this.container = awilix.createContainer();
  this.register();
}

ServiceLocator.prototype.register = function () {
  this.container
    .loadModules(
      [
        "./app/service/*.js",
        "./app/blockchainservice/*.js",
        "./app/controller/*.js",
      ],
      {
        formatName: "camelCase",
        resolverOptions: {
          lifetime: awilix.Lifetime.SINGLETON,
          register: awilix.asClass,
        },
      }
    )
    .register({
      logger: awilix.asValue(logger),
    })
    .register({
      uniqueIdGenerator: awilix.asValue(require("./unique_generate_id")),
    })

    .register({
      constants: awilix.asValue(require("../constants/constants")),
    })
    .register({
      configs: awilix.asValue(configs),
    })
    .register({
      ethers: awilix.asValue(ethers),
    })
    .register({
      monogdb: awilix.asValue(require("mongodb")),
    })
    .register({
      httpStatus: awilix.asValue(require("http-status")),
    })
    .register({
      fs: awilix.asValue(require("fs")),
    })
    .register({
      path: awilix.asValue(require("path")),
    })
    .register({
      Wallets: awilix.asValue(Wallets),
    })
    .register({
      Gateway: awilix.asValue(Gateway),
    })
    .register({
      mongoose: awilix.asValue(require("mongoose")),
    })
    .register({
      errs: awilix.asValue(require("http-errors")),
    })
    .register({
      ethers: awilix.asValue(require("hardhat")),
    });
};

ServiceLocator.prototype.get = function (dependencyName) {
  try {
    return this.container.resolve(dependencyName);
  } catch (err) {
    logger.error(err.message);
    throw err;
  }
};

module.exports = new ServiceLocator();
