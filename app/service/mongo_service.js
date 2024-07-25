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
   * Get documents by query
   * @param modelName mongoose model's name to query data from
   * @param query mongo query to execute
   * @param sortOption {field: sorting order} e.g. {name: 1} 1 for ascending and -1 for descending
   * @returns resulting object from query
   * @error NotFoundError
   */
  async getByQuery(modelName, query, projections = null, sortOption = {}) {
    // initialise model
    const model = this.getModelInstance(modelName);
    const result = await model
      .find(query, projections)
      .sort(sortOption) // sorts the data
      .lean();
    this.log.info(`${this.name} ${modelName} items fetched successfully`);
    return result;
  }

  async getById(modelName, id, noErr) {
    const model = this.getModelInstance(modelName);
    const result = await model.findById(id).lean();

    if (!result && !noErr) {
      const err = this.errs(
        this.httpStatus.NOT_FOUND,
        `${this.name} ${modelName} item with id - ${id} could not be found`
      );
      throw err;
    }
    this.log.info(
      `${this.name} ${modelName} item with id - ${id} fetched successfully`
    );

    return result;
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
