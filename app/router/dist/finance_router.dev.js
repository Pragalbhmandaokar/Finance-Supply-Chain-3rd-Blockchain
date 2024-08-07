"use strict";

module.exports.routes = function (router, serviceLocator) {
  router.post("/createFinancialRequest", function (req, res, next) {
    serviceLocator.get("financeController").financialRequesting(req, res, next);
  });
  router.post("/getAllFinancialRequest", function (req, res, next) {
    serviceLocator.get("financeController").getFinancingRequest(req, res, next);
  });
};