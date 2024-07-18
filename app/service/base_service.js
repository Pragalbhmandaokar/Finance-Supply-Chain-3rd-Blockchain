class BaseService {
  constructor(opts, modelName = "", blockchainName) {
    this.logger = opts.logger;
    this.modelName = modelName;
    this.chain = opts[blockchainName];
    this.databaseService = opts.databaseService;
    this.schemasWithCreator = ["Transaction", "banks", "Company", "Invoice"];
  }

  async create(body) {
    console.log(body);
    const result = await this.databaseService.create(this.modelName, body);
    this.logger.info(`${this.modelName} created successfully`);
    return result;
  }

  async get(id) {
    const result = await this.databaseService.getById(this.modelName, id);
    if (!result) {
      const err = this.errs(
        this.httpStatus.NOT_FOUND,
        `${this.modelName} with id: ${id} does not exists`
      );
      throw err;
    }

    this.logger.info(`${this.modelName} fetched successfully`);
    return result;
  }
}

module.exports = BaseService;
