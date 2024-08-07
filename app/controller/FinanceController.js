const BaseController = require("./BaseController");

class FinanceController extends BaseController {
  constructor(opts) {
    console.log("index");
    super(opts, "FinanceController", "financeService", "financeChain");
    this.logger = opts.logger;
    this.path = opts.path;
  }
  async financialRequesting(req, res, next) {
    this.logger.info("Financial Request generating");
    try {
      const { body } = req;
      const { result, transactionDetails } =
        await this.chain.financialRequesting(body);
      if (result == undefined) {
        res.send("Result is empty");
      }

      const UpdatedResult = {
        bankId: body.userId,
        transactionID: transactionDetails.transactionID,
      };
      const dbResult = await this.service.create(UpdatedResult);

      this.logger.info("Financial Request generated");
      res.send(dbResult);
    } catch (err) {
      this.logger.error(err.message);
      res.error(err.message);
    }
  }

  async updateFinancial(req, res, next) {
    this.logger.info("Updating Finanical Request");
    try {
      this.logger.info("Updated Financial Request");
      res.send("resut");
    } catch (err) {
      this.logger.error(err.message);
      res.error(err.message);
    }
  }

  async getFinancingRequest(req, res, next) {
    this.logger.info("getting financial Request");
    try {
      const { result } = await this.chain.getFinancialRequest();
      console.log(result);
      res.send(result);
    } catch (err) {
      this.logger.error(err.message);
      res.error(err.message);
    }
  }
}

module.exports = FinanceController;
