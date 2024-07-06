const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");

const transactionSchema = new mongoose.Schema({
  blockchain_transaction_id: String, // Hash or identifier of the blockchain transaction
  blockchain_network: String,
  smart_contract_address: String,
  event_details: Object, // Details of the blockchain event
  additional_metadata: Object, // Any additional data relevant to the transaction
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
module.exports = mongoose.model("transactions", transactionSchema);
