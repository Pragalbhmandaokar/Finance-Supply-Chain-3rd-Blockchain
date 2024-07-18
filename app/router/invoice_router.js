module.exports.routes = (router, serviceLocator) => {
  router.post("/createInvoice", (req, res, next) => {
    serviceLocator.get("invoiceController").createInvoice(req, res, next);
  });
  router.post("/getInvoices", (req, res, next) => {
    serviceLocator.get("invoiceController").getAllInvoices(req, res, next);
  });
  router.post("/acceptInvoice", (req, res, next) => {
    serviceLocator.get("invoiceController").approveInvoice(req, res, next);
  });
};
