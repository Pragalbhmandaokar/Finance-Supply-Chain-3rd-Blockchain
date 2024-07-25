"use strict";

var bodyParser = require("body-parser");

var express = require("express");

var _require = require("http"),
    createServer = _require.createServer;

var serviceLocator = require("./app/lib/service_locator");

var cors = require("cors");

var httpContext = require("express-http-context");

var logger = serviceLocator.get("logger");

var config = require("./app/config/configs");

var Database = require("./app/config/Database");

var routesV1 = require("./app/router");

var server = express();
server.use(cors("*"));
server.use(bodyParser.json());
server.use(httpContext.middleware);
var routerV1 = express.Router();
server.use(routerV1);
routesV1(routerV1, serviceLocator);
var httpServer = createServer(server);

function setupEventListeners() {
  var contract;
  return regeneratorRuntime.async(function setupEventListeners$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(serviceLocator.get("invoiceChain").getContract("440ff6184ca2a5fa5d072d60bd2e3bc1b0ef2d2f9dbc50f6328a3f3e04ebcd8c"));

        case 3:
          contract = _context2.sent;
          console.log("Contract instance retrieved");
          contract.on("*", function _callee(event) {
            var notifyBody, notificationBuilder, _notifyBody, _notificationBuilder;

            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!(event.event == "InvoiceApproved")) {
                      _context.next = 13;
                      break;
                    }

                    notifyBody = {
                      NotificationType: "INVOICE_APPROVED",
                      invoiceId: event.transactionHash,
                      SupplierId: event.args[0].toString() || "0",
                      BuyerId: event.args[1].toString()
                    };
                    _context.prev = 2;
                    logger.info("Invoice Approval Triggered");
                    _context.next = 6;
                    return regeneratorRuntime.awrap(serviceLocator.get("notificationService").createNotification(notifyBody));

                  case 6:
                    notificationBuilder = _context.sent;
                    console.log(notificationBuilder);
                    _context.next = 13;
                    break;

                  case 10:
                    _context.prev = 10;
                    _context.t0 = _context["catch"](2);
                    console.log("Err: ", _context.t0);

                  case 13:
                    if (!(event.event == "InvoiceCreated")) {
                      _context.next = 26;
                      break;
                    }

                    _notifyBody = {
                      NotificationType: "INVOICE_GENERATED",
                      invoiceId: event.transactionHash,
                      SupplierId: event.args[0].toString() || "0",
                      BuyerId: event.args[1].toString()
                    };
                    _context.prev = 15;
                    logger.info("Invoice Approval Triggered");
                    _context.next = 19;
                    return regeneratorRuntime.awrap(serviceLocator.get("notificationService").createNotification(_notifyBody));

                  case 19:
                    _notificationBuilder = _context.sent;
                    console.log(_notificationBuilder);
                    _context.next = 26;
                    break;

                  case 23:
                    _context.prev = 23;
                    _context.t1 = _context["catch"](15);
                    console.log("Err: ", _context.t1);

                  case 26:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, null, [[2, 10], [15, 23]]);
          });
          console.log("Event listener setup complete.");
          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.error("error in creating interactive script", _context2.t0);

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
}

setupEventListeners().then(function () {
  return console.log("Event listeners set up.");
})["catch"](console.error);

var startServer = function startServer() {
  return regeneratorRuntime.async(function startServer$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Database._connect());

        case 2:
          process.on("uncaughtException", function (err) {
            logger.error("Caught global exception");
            logger.debug(err); // eslint-disable-next-line no-process-exit

            Number(config.app.coredump) ? process.abort() : process.exit(1);
          });
          process.on("unhandledRejection", function (reason) {
            logger.error("unhandled promise rejection");
            logger.debug(reason); // eslint-disable-next-line no-process-exit

            Number(config.app.coredump) ? process.abort() : process.exit(1);
          });
          logger.info("Start listening on server");
          httpServer.listen(3000, function () {
            logger.info("".concat(config.app.name, " server is running on port: ").concat(config.app.port));
          });

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
};

startServer();