module.exports.routes = (router, serviceLocator) => {
  router.post("/createFinance", (req, res, next) => {
    serviceLocator.get("bankController").main();
  });

  router.post("/createBank", (req, res, next) => {
    serviceLocator.get("bankController").createBank(req, res, next);
  });
};
