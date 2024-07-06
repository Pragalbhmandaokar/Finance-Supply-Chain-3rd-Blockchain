class BaseService {
  constructor(opts, modelName = "") {
    this.logger = opts.logger;
    this.modelName = modelName;
    this.databaseService = opts.databaseService;
    this.schemasWithCreator = ["Transaction", "banks", "finance"];
  }

  async create(body, user) {
    if (this.schemasWithCreator.indexOf(this.modelName) > -1) {
      body.additional_metadata = {
        author: {
          _id: user._id,
        },
      };
    }
    const result = await this.databaseService.create(this.modelName, body);
    this.logger.info(`${this.modelName} created successfully`);
    return result.toJSON();
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
