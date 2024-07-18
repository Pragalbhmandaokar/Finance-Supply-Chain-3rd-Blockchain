const bankRoutes = require("./bank_router");
const financeRoutes = require("./finance_router");
const companyRoutes = require("./company_router");
const invoiceRoutes = require("./invoice_router");
module.exports = (router, serviceLocator) => {
  bankRoutes.routes(router, serviceLocator);
  financeRoutes.routes(router, serviceLocator);
  companyRoutes.routes(router, serviceLocator);
  invoiceRoutes.routes(router, serviceLocator);
};
