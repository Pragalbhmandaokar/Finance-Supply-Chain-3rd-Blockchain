const serviceLocator = require("../lib/service_locator");

const mongoose = serviceLocator.get("mongoose");

const FinancialRequestSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  bankId: { type: String, required: true },
  transactionID: { type: String, required: true },
  transactionExpired: {
    type: Boolean,
    required: true,
    default: false,
  },
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

module.exports = mongoose.model("finance", FinancialRequestSchema);

// _id: { type: String, required: true },
//   bankName: { type: String, required: true },
//   country: { type: String, required: true },
//   contact_information: { type: String, required: true },
//   credit_rating: { type: String, required: true },
//   blockchain_network: String,
//   verified: {
//     type: Boolean,
//     required: true,
//     default: true,
//   },
//   sort_code: {
//     type: String,
//     required: true,
//   },
//   post_code: {
//     type: String,
//     required: true,
//   },
