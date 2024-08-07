"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require("../Utils/blockchainUtils"),
    getNetworkDetails = _require.getNetworkDetails,
    getFinancialCppPath = _require.getFinancialCppPath;

var _require2 = require("fabric-network"),
    Gateway = _require2.Gateway,
    Wallets = _require2.Wallets;

var FinanceChain =
/*#__PURE__*/
function () {
  function FinanceChain(opts) {
    var modelName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var chaincodeName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Finance";

    _classCallCheck(this, FinanceChain);

    this.logger = opts.logger;
    this.modelName = modelName;
    this.chaincodeName = getNetworkDetails(chaincodeName);
    this.path = opts.path;
  }

  _createClass(FinanceChain, [{
    key: "financialRequesting",
    value: function financialRequesting(body) {
      var args, ccpPath, ccp, walletPath, wallet, identity, gateway, network, contract, transaction, result;
      return regeneratorRuntime.async(function financialRequesting$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.logger.info("creating financial Request");
              args = body.args;
              _context.prev = 2;
              _context.next = 5;
              return regeneratorRuntime.awrap(getFinancialCppPath());

            case 5:
              ccpPath = _context.sent;
              ccp = ccpPath;
              walletPath = this.path.join(process.cwd(), "financial-wallet");
              _context.next = 10;
              return regeneratorRuntime.awrap(Wallets.newFileSystemWallet(walletPath));

            case 10:
              wallet = _context.sent;
              _context.next = 13;
              return regeneratorRuntime.awrap(wallet.get("admin"));

            case 13:
              identity = _context.sent;

              if (identity) {
                _context.next = 18;
                break;
              }

              this.logger.info('An identity for the admin user "admin" does not exist in the wallet');
              this.logger.info("Run the enrollAdmin.js application before retrying");
              return _context.abrupt("return");

            case 18:
              gateway = new Gateway();
              _context.next = 21;
              return regeneratorRuntime.awrap(gateway.connect(ccp, {
                wallet: wallet,
                identity: identity,
                discovery: {
                  enabled: true,
                  asLocalhost: true
                }
              }));

            case 21:
              _context.next = 23;
              return regeneratorRuntime.awrap(gateway.getNetwork("financialchannel"));

            case 23:
              network = _context.sent;
              this.logger.info("here");
              contract = network.getContract("financeChaincode"); // Submit the specified transaction

              transaction = contract.createTransaction("createFinancingRequest");
              _context.next = 29;
              return regeneratorRuntime.awrap(transaction.submit.apply(transaction, _toConsumableArray(args)));

            case 29:
              result = _context.sent;
              this.logger.info("Transaction has been submitted, result is: ".concat((result.toString(), transaction.getTransactionId())));
              return _context.abrupt("return", {
                result: result.toString(),
                transactionDetails: {
                  transactionID: transaction.getTransactionId()
                }
              });

            case 34:
              _context.prev = 34;
              _context.t0 = _context["catch"](2);
              console.error("Failed to submit transaction: ".concat(_context.t0));
              return _context.abrupt("return", _context.t0.toString());

            case 38:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[2, 34]]);
    }
  }, {
    key: "getFinancialRequest",
    value: function getFinancialRequest() {
      var ccpPath, ccp, walletPath, wallet, identity, gateway, network, contract, response;
      return regeneratorRuntime.async(function getFinancialRequest$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this.logger.info("creating financial Request");
              _context2.prev = 1;
              _context2.next = 4;
              return regeneratorRuntime.awrap(getFinancialCppPath());

            case 4:
              ccpPath = _context2.sent;
              ccp = ccpPath;
              walletPath = this.path.join(process.cwd(), "financial-wallet");
              _context2.next = 9;
              return regeneratorRuntime.awrap(Wallets.newFileSystemWallet(walletPath));

            case 9:
              wallet = _context2.sent;
              _context2.next = 12;
              return regeneratorRuntime.awrap(wallet.get("admin"));

            case 12:
              identity = _context2.sent;

              if (identity) {
                _context2.next = 17;
                break;
              }

              this.logger.info('An identity for the admin user "admin" does not exist in the wallet');
              this.logger.info("Run the enrollAdmin.js application before retrying");
              return _context2.abrupt("return");

            case 17:
              gateway = new Gateway();
              _context2.next = 20;
              return regeneratorRuntime.awrap(gateway.connect(ccp, {
                wallet: wallet,
                identity: identity,
                discovery: {
                  enabled: true,
                  asLocalhost: true
                }
              }));

            case 20:
              _context2.next = 22;
              return regeneratorRuntime.awrap(gateway.getNetwork("financialchannel"));

            case 22:
              network = _context2.sent;
              this.logger.info("here");
              contract = network.getContract("financeChaincode"); // Submit the specified transaction

              _context2.next = 27;
              return regeneratorRuntime.awrap(contract.evaluateTransaction("fetchAllFinancialRequests"));

            case 27:
              response = _context2.sent;
              console.log("Company list retrieved:", response);
              return _context2.abrupt("return", {
                result: response.toString()
              });

            case 32:
              _context2.prev = 32;
              _context2.t0 = _context2["catch"](1);
              console.error("Failed to submit transaction: ".concat(_context2.t0));
              return _context2.abrupt("return", _context2.t0.toString());

            case 36:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[1, 32]]);
    }
  }]);

  return FinanceChain;
}();

module.exports = FinanceChain;