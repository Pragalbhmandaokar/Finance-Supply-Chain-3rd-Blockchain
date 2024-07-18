module.exports.routes = (router, serviceLocator) => {
  router.post("/createCompany", (req, res, next) => {
    serviceLocator.get("companyController").createCompany(req, res, next);
  });
  router.post("/initCompanyUser", (req, res, next) => {
    serviceLocator.get("companyController").initCompanyUser(req, res, next);
  });
  router.get("/getCompanyList", (req, res, next) => {
    serviceLocator.get("companyController").getCompanyList(req, res, next);
  });
  router.post("/login", (req, res, next) => {
    serviceLocator.get("companyController").companyLogin(req, res, next);
  });
  router.get("/getCompanyById", (req, res, next) => {
    serviceLocator.get("companyController").getCompanyById(req, res, next);
  });
};
