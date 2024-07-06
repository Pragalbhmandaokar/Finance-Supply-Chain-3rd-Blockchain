const BaseService = require("./base_service");

class FinanceService extends BaseService {
  constructor(opts) {
    super(opts, "finance");
    this.logger = opts.logger;
  }
}

module.exports = FinanceService;
