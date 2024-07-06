const bankRoutes = require("./bank_router");
const financeRoutes = require("./finance_router");
module.exports = (router, serviceLocator) => {
  bankRoutes.routes(router, serviceLocator);
  financeRoutes.routes(router, serviceLocator);
};
