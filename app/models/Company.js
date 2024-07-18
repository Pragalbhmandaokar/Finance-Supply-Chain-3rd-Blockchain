const serviceLocator = require("../lib/service_locator");

const mongoose = serviceLocator.get("mongoose");

const CompanySchema = new mongoose.Schema({
  _id: { type: String, required: true },
  transactionID: { type: String, required: true },
  blockchain_network: String,
  companyName: String,
  created_at: {
    required: true,
    type: Date,
    default: Date.now,
  },
  update_at: {
    required: true,
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("company", CompanySchema);
