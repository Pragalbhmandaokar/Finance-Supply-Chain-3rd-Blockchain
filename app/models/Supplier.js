const serviceLocator = require("../lib/service_locator");

const mongoose = serviceLocator.get("mongoose");

const SupplierSchema = mongoose.Schema({
  supplier_id: {
    type: String,
    required: true,
  },
  supplier_contract_id: {
    type: String,
    required: true,
  },
  blockchain_network: String,
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

module.exports = mongoose.model("suppliers", SupplierSchema);
