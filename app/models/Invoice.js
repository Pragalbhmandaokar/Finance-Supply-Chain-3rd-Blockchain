const serviceLocator = require("../lib/service_locator");

const mongoose = serviceLocator.get("mongoose");

const InvoiceSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  InvoiceId: { type: String, required: true },
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

module.exports = mongoose.model("invoice", InvoiceSchema);
