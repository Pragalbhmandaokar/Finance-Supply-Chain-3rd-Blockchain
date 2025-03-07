module.exports.routes = (router, serviceLocator) => {
  router.post("/createFinancialRequest", (req, res, next) => {
    serviceLocator.get("financeController").financialRequesting(req, res, next);
  });

  router.post("/getAllFinancialRequest", (req, res, next) => {
    serviceLocator.get("financeController").getFinancingRequest(req, res, next);
  });
};
