module.exports.routes = (router, serviceLocator) => {
  router.post("/getTransactions", (req, res, next) => {
    const { body } = req;

    serviceLocator.get("baseChain").getTransactionDetails(body.tx);
  });
};
