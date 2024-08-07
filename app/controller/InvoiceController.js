const BaseController = require("./BaseController");

class InvoiceController extends BaseController {
  constructor(opts) {
    console.log("called");
    // super(opts, "FinanceController", "financeService", "financeChain");
    super(opts, "InvoiceController", "invoiceService", "invoiceChain");
    this.logger = opts.logger;
    this.path = opts.path;
  }
  async createInvoice(req, res, next) {
    this.logger.info("InvoiceController Incoice Creating");
    try {
      const { body } = req;
      const chainResult = await this.chain.createInvoice(body);
      const dbData = {
        InvoiceId: chainResult.transactionId,
        blockchain_network: "Ethereum",
      };
      const dbResult = await this.service.create(dbData);
      res.send(dbResult);
    } catch (err) {
      this.logger.error("InvoiceController" + err.message);
      next(err);
    }
  }

  async getAllInvoices(req, res, next) {
    this.logger.info("InvoiceController Incoice Creating");
    try {
      const { body } = req;
      const chainResult = await this.chain.getInvoices(body);
      res.send(chainResult);
    } catch (err) {
      this.logger.error(err.message);
      next(err);
    }
  }

  async approveInvoice(req, res, next) {
    this.logger.info("InvoiceController Incoice Accepting");
    try {
      const { body } = req;
      console.log(body);
      const chainResult = await this.chain.approveInvoice(body);
      res.send(chainResult);
    } catch (err) {
      this.logger.error(err.message);
      next(err);
    }
  }
  async payInvoice(req, res, next) {
    this.logger.info("InvoiceController Incoice Accepting");
    try {
      const { body } = req;
      const chainResult = await this.chain.approveInvoice(body);
      res.send(chainResult);
    } catch (err) {
      this.logger.error(err.message);
      next(err);
    }
  }
}
module.exports = InvoiceController;
