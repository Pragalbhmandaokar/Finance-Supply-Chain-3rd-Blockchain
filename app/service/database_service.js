"use strict";

/**
 * Database wrapper to switch db integration based on some env var
 */

class DatabaseService {
  constructor(opts) {
    this.dbService = opts.mongoService;
  }

  async getByQuery(modelName, query, projections = null, sortOption = {}) {
    return await this.dbService.getByQuery(
      modelName,
      query,
      projections,
      sortOption
    );
  }

  async getByQueryWithPagination(
    modelName,
    query,
    projections = null,
    sortOption = {},
    page = 0,
    limit = 20
  ) {
    return await this.dbService.getByQueryWithPagination(
      modelName,
      query,
      projections,
      sortOption,
      page,
      limit
    );
  }

  async getCount(modelName, query) {
    return await this.dbService.getCount(modelName, query);
  }

  async getById(modelName, id, noErr = false) {
    return await this.dbService.getById(modelName, id, noErr);
  }

  async getOneByQuery(modelName, query, noErr = false, projections = null) {
    return await this.dbService.getOneByQuery(
      modelName,
      query,
      noErr,
      projections
    );
  }

  async aggregate(modelName, aggregationPipe = []) {
    return await this.dbService.aggregate(modelName, aggregationPipe);
  }

  async populate(refModelName, records, options) {
    return await this.dbService.populate(refModelName, records, options);
  }

  async create(modelName, newObject, skipUId) {
    return await this.dbService.create(modelName, newObject, skipUId);
  }

  async insertMany(modelName, newObjects, skipUId) {
    return await this.dbService.insertMany(modelName, newObjects, skipUId);
  }

  async updateOne(modelName, query, updObjects, throwError = true) {
    return await this.dbService.updateOne(
      modelName,
      query,
      updObjects,
      throwError
    );
  }

  async updateMany(modelName, query, updObjects) {
    return await this.dbService.updateMany(modelName, query, updObjects);
  }

  async update(modelName, id, updateObject) {
    return await this.dbService.update(modelName, id, updateObject);
  }

  async delete(modelName, id) {
    return await this.dbService.delete(modelName, id);
  }

  async deleteMany(modelName, query) {
    return await this.dbService.deleteMany(modelName, query);
  }

  async findAndDelete(modelName, query) {
    return await this.dbService.findAndDelete(modelName, query);
  }

  async findByIdAndUpdate(modelName, id, updateObject, noErr) {
    return await this.dbService.findByIdAndUpdate(
      modelName,
      id,
      updateObject,
      noErr
    );
  }

  async getSequenceId(type, factoryId) {
    return await this.dbService.getSequenceId(type, factoryId);
  }
}

module.exports = DatabaseService;
