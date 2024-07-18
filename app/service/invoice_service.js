const BaseService = require("./base_service");

class InvoiceService extends BaseService {
  constructor(opts) {
    console.log("service");
    super(opts, "invoice");
    this.logger = opts.logger;
  }
}

module.exports = InvoiceService;
