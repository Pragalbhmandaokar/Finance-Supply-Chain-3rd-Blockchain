const serviceLocator = require("../lib/service_locator");

const mongoose = serviceLocator.get("mongoose");

const BankSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  bankName: { type: String, required: true },
  country: { type: String, required: true },
  contact_information: { type: String, required: true },
  credit_rating: { type: String, required: true },
  blockchain_network: String,
  bankAddress: { type: String, required: true },
  verified: {
    type: Boolean,
    required: true,
    default: true,
  },
  sort_code: {
    type: String,
    required: true,
  },
  post_code: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("banks", BankSchema);

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
