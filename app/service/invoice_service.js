const BaseService = require("./base_service");

class InvoiceService extends BaseService {
  constructor(opts) {
    super(opts, "invoice", "invoiceChain");
    this.logger = opts.logger;
  }

  async createInvoice() {
    this.logger.info("called");
  }
}

module.exports = InvoiceService;
