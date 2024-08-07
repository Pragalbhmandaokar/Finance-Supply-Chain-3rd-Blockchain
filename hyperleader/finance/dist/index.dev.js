"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require("fabric-contract-api"),
    Contract = _require.Contract;

var FinancialContract =
/*#__PURE__*/
function (_Contract) {
  _inherits(FinancialContract, _Contract);

  function FinancialContract() {
    _classCallCheck(this, FinancialContract);

    return _possibleConstructorReturn(this, _getPrototypeOf(FinancialContract).apply(this, arguments));
  }

  _createClass(FinancialContract, [{
    key: "initLedger",
    value: function initLedger(ctx) {
      return regeneratorRuntime.async(function initLedger$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log("Financial Ledger Initialized");

            case 1:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "createFinancingRequest",
    value: function createFinancingRequest(ctx, bank, amount, supplier, buyer) {
      var clientOrg, requestId, financingRequest;
      return regeneratorRuntime.async(function createFinancingRequest$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              clientOrg = ctx.clientIdentity.getMSPID();

              if (!(clientOrg !== "FinancialMSP")) {
                _context2.next = 3;
                break;
              }

              throw new Error("Client of org ".concat(clientOrg, " is not authorized to create a token"));

            case 3:
              requestId = "".concat(supplier, ":").concat(Date.now());
              financingRequest = {
                docType: "financingRequest",
                supplier: supplier,
                bank: bank,
                buyer: buyer,
                amount: amount,
                approved: false,
                disbursed: false,
                approvalTimestamp: null,
                disbursementTimestamp: null
              };
              _context2.next = 7;
              return regeneratorRuntime.awrap(ctx.stub.putState(requestId, Buffer.from(JSON.stringify(financingRequest))));

            case 7:
              console.log("Financing Request Created: Request ID ".concat(requestId));
              return _context2.abrupt("return", JSON.stringify(financingRequest));

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "approveFinancingRequest",
    value: function approveFinancingRequest(ctx, requestId) {
      var requestAsBytes, request;
      return regeneratorRuntime.async(function approveFinancingRequest$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(ctx.stub.getState(requestId));

            case 2:
              requestAsBytes = _context3.sent;

              if (!(!requestAsBytes || requestAsBytes.length === 0)) {
                _context3.next = 5;
                break;
              }

              throw new Error("Request ".concat(requestId, " does not exist."));

            case 5:
              request = JSON.parse(requestAsBytes.toString());
              request.approved = true;
              request.approvalTimestamp = new Date().toISOString();
              _context3.next = 10;
              return regeneratorRuntime.awrap(ctx.stub.putState(requestId, Buffer.from(JSON.stringify(request))));

            case 10:
              console.log("Financing Request Approved: Request ID ".concat(requestId));
              return _context3.abrupt("return", JSON.stringify(request));

            case 12:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  }, {
    key: "disburseFunds",
    value: function disburseFunds(ctx, requestId) {
      var requestAsBytes, request;
      return regeneratorRuntime.async(function disburseFunds$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(ctx.stub.getState(requestId));

            case 2:
              requestAsBytes = _context4.sent;

              if (!(!requestAsBytes || requestAsBytes.length === 0)) {
                _context4.next = 5;
                break;
              }

              throw new Error("Request ".concat(requestId, " does not exist."));

            case 5:
              request = JSON.parse(requestAsBytes.toString());

              if (request.approved) {
                _context4.next = 8;
                break;
              }

              throw new Error("Request must be approved before disbursement.");

            case 8:
              if (!request.disbursed) {
                _context4.next = 10;
                break;
              }

              throw new Error("Funds have already been disbursed.");

            case 10:
              request.disbursed = true;
              request.disbursementTimestamp = new Date().toISOString();
              _context4.next = 14;
              return regeneratorRuntime.awrap(ctx.stub.putState(requestId, Buffer.from(JSON.stringify(request))));

            case 14:
              console.log("Funds Disbursed: Request ID ".concat(requestId));
              return _context4.abrupt("return", JSON.stringify(request));

            case 16:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
  }, {
    key: "getFinancingRequest",
    value: function getFinancingRequest(ctx, requestId) {
      var requestAsBytes;
      return regeneratorRuntime.async(function getFinancingRequest$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return regeneratorRuntime.awrap(ctx.stub.getState(requestId));

            case 2:
              requestAsBytes = _context5.sent;

              if (!(!requestAsBytes || requestAsBytes.length === 0)) {
                _context5.next = 5;
                break;
              }

              throw new Error("Request ".concat(requestId, " does not exist."));

            case 5:
              console.log("Financing Request Retrieved: Request ID ".concat(requestId));
              return _context5.abrupt("return", requestAsBytes.toString());

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      });
    }
  }, {
    key: "fetchAllFinancialRequests",
    value: function fetchAllFinancialRequests(ctx) {
      var queryString, iterator, allResults, res, record;
      return regeneratorRuntime.async(function fetchAllFinancialRequests$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              queryString = {
                selector: {
                  docType: "financingRequest"
                }
              };
              _context6.next = 3;
              return regeneratorRuntime.awrap(ctx.stub.getQueryResult(JSON.stringify(queryString)));

            case 3:
              iterator = _context6.sent;
              allResults = [];

            case 5:
              if (!true) {
                _context6.next = 16;
                break;
              }

              _context6.next = 8;
              return regeneratorRuntime.awrap(iterator.next());

            case 8:
              res = _context6.sent;

              if (res.value && res.value.value.toString()) {
                record = void 0;

                try {
                  record = JSON.parse(res.value.value.toString());
                } catch (err) {
                  console.log(err);
                  record = res.value.value.toString();
                }

                allResults.push(record);
              }

              if (!res.done) {
                _context6.next = 14;
                break;
              }

              _context6.next = 13;
              return regeneratorRuntime.awrap(iterator.close());

            case 13:
              return _context6.abrupt("break", 16);

            case 14:
              _context6.next = 5;
              break;

            case 16:
              console.log("All Financial Requests Retrieved");
              return _context6.abrupt("return", JSON.stringify(allResults));

            case 18:
            case "end":
              return _context6.stop();
          }
        }
      });
    }
  }]);

  return FinancialContract;
}(Contract);

module.exports = FinancialContract;