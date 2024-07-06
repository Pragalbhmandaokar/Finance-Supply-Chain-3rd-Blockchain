const BaseService = require("./base_service");

class TransactionService extends BaseService {
  constructor(opts) {
    super(opts, "Transaction");
  }
}

module.exports = TransactionService;
