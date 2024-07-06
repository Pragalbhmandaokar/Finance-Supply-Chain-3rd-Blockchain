const BaseService = require("./base_service");

class BankService extends BaseService {
  constructor(opts) {
    super(opts, "banks");
    this.logger = opts.logger;
  }

  async createBank(body) {
    this.logger.info("bankService register bank");

    const result = await this.databaseService.create(this.modelName, body);
    this.logger.info(`${this.modelName} created successfully`);
    return result.toJSON();
  }
}

module.exports = BankService;
