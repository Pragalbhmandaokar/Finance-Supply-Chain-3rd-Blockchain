module.exports.routes = (router, serviceLocator) => {
  router.post("/createFinance", (req, res, next) => {
    serviceLocator.get("bankController").initBankUser(req, res, next);
  });

  router.post("/createBank", (req, res, next) => {
    serviceLocator.get("bankController").createBank(req, res, next);
  });

  router.post("/loginBank", (req, res, next) => {
    serviceLocator.get("bankController").login(req, res, next);
  });
};
