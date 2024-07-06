"use strict";
class MongoService {
  constructor(opts) {
    this.uIdGen = opts.uniqueIdGenerator;
    this.mongoose = opts.mongoose;
    this.errs = opts.errs;
    this.name = "Mongo Service:";
    this.log = opts.logger;
    this.httpStatus = opts.httpStatus;
    this.constants = opts.constants;
    this.modelNameToIdPrefix = {
      banks: "Bank",
    };
  }
  /**
   * get model instance
   * @param modelName model instance to grab
   * @returns model instance
   */
  getModelInstance(modelName) {
    return this.mongoose.model(modelName);
  }

  /**
   * Create a document
   * @param modelName mongoose model's name to create
   * @param newObject json object to create the new document with
   * @param skipUId flag to skip uid generation
   * @returns newly created Object
   */
  async create(modelName, newObject, skipUId = false) {
    const model = this.getModelInstance(modelName);
    let newObjectInstance = new model(newObject);
    console.log(model);
    if (!skipUId) {
      newObjectInstance._id = await this.uIdGen.getId(
        this.modelNameToIdPrefix[modelName]
      );
    }

    newObjectInstance = await newObjectInstance.save();
    this.log.info(`${this.name} ${modelName} created successfully`);
    return newObjectInstance;
  }
}

module.exports = MongoService;
