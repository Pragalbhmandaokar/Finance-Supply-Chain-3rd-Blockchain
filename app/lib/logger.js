const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, json, printf } = format;
const httpContext = require("express-http-context");

const createTransports = function (config) {
  const customTransports = [];

  // Setup the file transport
  if (config.info_file) {
    customTransports.push(
      new transports.File({
        filename: config.info_file,
        level: "info",
      })
    );
  }
  if (config.error_file) {
    customTransports.push(
      new transports.File({
        filename: config.error_file,
        level: "error",
      })
    );
  }
  if (config.debug_file) {
    customTransports.push(
      new transports.File({
        filename: config.debug_file,
        level: "debug",
      })
    );
  }

  // If config.console is set to true, include a console logger
  if (config.console) {
    customTransports.push(
      new transports.Console({
        level: "debug",
        format: printf(
          (info) =>
            `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
        ),
      })
    );
  }

  return customTransports;
};

const reqIdFormat = format((info, opts) => {
  const reqId = httpContext.get("req_id");
  const wid = httpContext.get("wid");
  const newInfo = { ...info };

  if (reqId) {
    newInfo.req_id = reqId;
  }
  if (wid) {
    newInfo.wid = wid;
  }

  return newInfo;
});

module.exports = {
  create(config) {
    return createLogger({
      level: config.defaultLevel || "info",
      transports: createTransports(config),
      format: combine(
        label({ label: "API" }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        reqIdFormat(),
        json()
      ),
    });
  },
};
