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

var BaseController = require("./BaseController");

var FinanceController =
/*#__PURE__*/
function (_BaseController) {
  _inherits(FinanceController, _BaseController);

  function FinanceController(opts) {
    var _this;

    _classCallCheck(this, FinanceController);

    console.log("index");
    _this = _possibleConstructorReturn(this, _getPrototypeOf(FinanceController).call(this, opts, "FinanceController", "financeService", "financeChain"));
    _this.logger = opts.logger;
    _this.path = opts.path;
    return _this;
  }

  _createClass(FinanceController, [{
    key: "financialRequesting",
    value: function financialRequesting(req, res, next) {
      var body, _ref, result, transactionDetails, UpdatedResult, dbResult;

      return regeneratorRuntime.async(function financialRequesting$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.logger.info("Financial Request generating");
              _context.prev = 1;
              body = req.body;
              _context.next = 5;
              return regeneratorRuntime.awrap(this.chain.financialRequesting(body));

            case 5:
              _ref = _context.sent;
              result = _ref.result;
              transactionDetails = _ref.transactionDetails;

              if (result == undefined) {
                res.send("Result is empty");
              }

              UpdatedResult = {
                bankId: body.userId,
                transactionID: transactionDetails.transactionID
              };
              _context.next = 12;
              return regeneratorRuntime.awrap(this.service.create(UpdatedResult));

            case 12:
              dbResult = _context.sent;
              this.logger.info("Financial Request generated");
              res.send(dbResult);
              _context.next = 21;
              break;

            case 17:
              _context.prev = 17;
              _context.t0 = _context["catch"](1);
              this.logger.error(_context.t0.message);
              res.error(_context.t0.message);

            case 21:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[1, 17]]);
    }
  }, {
    key: "updateFinancial",
    value: function updateFinancial(req, res, next) {
      return regeneratorRuntime.async(function updateFinancial$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this.logger.info("Updating Finanical Request");

              try {
                this.logger.info("Updated Financial Request");
                res.send("resut");
              } catch (err) {
                this.logger.error(err.message);
                res.error(err.message);
              }

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getFinancingRequest",
    value: function getFinancingRequest(req, res, next) {
      var _ref2, result;

      return regeneratorRuntime.async(function getFinancingRequest$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              this.logger.info("getting financial Request");
              _context3.prev = 1;
              _context3.next = 4;
              return regeneratorRuntime.awrap(this.chain.getFinancialRequest());

            case 4:
              _ref2 = _context3.sent;
              result = _ref2.result;
              console.log(result);
              res.send(result);
              _context3.next = 14;
              break;

            case 10:
              _context3.prev = 10;
              _context3.t0 = _context3["catch"](1);
              this.logger.error(_context3.t0.message);
              res.error(_context3.t0.message);

            case 14:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[1, 10]]);
    }
  }]);

  return FinanceController;
}(BaseController);

module.exports = FinanceController;