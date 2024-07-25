class BaseController {
  constructor(
    opts,
    name = "BaseController",
    serviceName,
    blockchainName = "blockchainService"
  ) {
    this.logger = opts.logger;
    this.service = opts[serviceName];
    this.chain = opts[blockchainName];
    this.name = name;
    this.errs = opts.errs;
  }

  async create(parent, args, context) {
    this.logger.debug(`${this.name} create() called`);
    try {
      let { input: body } = args;
      let { user } = context;
      const result = await this.service.create(body, user);
      return result;
    } catch (err) {
      this.logger.error(err.message);
      throw new Error(err);
    }
  }

  async get(parent, args, context) {
    this.logger.debug(`${this.name} get() called`);
    try {
      const { id } = args;
      const result = await this.service.get(id);
      return result;
    } catch (err) {
      this.logger.error(err.message);
      throw new Error(err);
    }
  }

  async getAll(parent, args, context) {
    this.logger.debug(`${this.name} getAll() called`);
    try {
      const result = await this.service.getAll(args);
      return result;
    } catch (err) {
      this.logger.error(err.message);
      throw new Error(err);
    }
  }
  async update(parent, args, context) {
    this.logger.debug(`${this.name} update() called`);

    try {
      const { id } = args;
      const { input: body } = args;
      const result = await this.service.update(id, body);
      return result;
    } catch (err) {
      this.logger.error(err.message);
      throw new Error(err);
    }
  }

  async delete(parent, args, context) {
    this.logger.debug(`${this.name} delete() called`);
    try {
      const { id } = args;
      const result = await this.service.delete(id);
      return result;
    } catch (err) {
      this.logger.error(err.message);
      throw new Error(err);
    }
  }

  async getCount(req, res, next) {
    this.logger.debug(`${this.name} getCount() called`);
    try {
      const query = req.query || {};
      const result = await this.service.getCount(query);
      res.send(result);
    } catch (err) {
      this.logger.error(err.message);
      next(err);
    }
  }
}

module.exports = BaseController;
