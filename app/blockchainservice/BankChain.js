class BankChain {
  constructor(opts, modelName = "", chaincodeName = "Bank") {
    this.logger = opts.logger;
    this.modelName = modelName;
    this.path = opts.path;
  }
}
