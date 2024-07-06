"use strict";

module.exports = {
  app: {
    name: "3rd Generation Blockchain",
    port: process.env.APP_PORT || 3000,
    environment: process.env.APPLICATION_ENV,
    logpath: process.env.LOG_PATH,
    JWT_SECRET: process.env.JWT_SECRET || "supersecret",
    CIPHER_SECRET: process.env.CIPHER_SECRET || "secret",
    TIMEOUT: 120000,
    coredump: process.env.CORE_DUMP || false,
    tokenLength: process.env.TOKEN_LENGTH || 90,
    cors_options:
      process.env.APPLICATION_ENV == "production"
        ? {
            origin: (process.env.CORS_OPTION || "").split(","),
          }
        : {},
    graphql_introspection:
      process.env.APPLICATION_ENV == "production" ? false : true,
  },
  application_logging: {
    info_file: process.env.INFO_LOG_PATH || "logs/info.log",
    error_file: process.env.ERROR_LOG_PATH || "logs/error.log",
    debug_file: process.env.DEBUG_LOG_PATH || "logs/debug.log",
    console: process.env.LOG_ENABLE_CONSOLE || true,
  },
};
