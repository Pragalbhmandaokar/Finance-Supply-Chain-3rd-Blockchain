const BaseService = require("./base_service");

class UserService extends BaseService {
  constructor(opts) {
    super(opts, "users");
    this.logger = opts.logger;
  }
}

module.exports = UserService;
