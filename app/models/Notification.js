const serviceLocator = require("../lib/service_locator");

const mongoose = serviceLocator.get("mongoose");

const NotificationSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  NotificationType: { type: String, required: true },
  InvoiceId: { type: String, required: true },
  SupplierId: { type: String, required: true },
  BuyerId: { type: String, required: true },
  Read: {
    required: true,
    type: Boolean,
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

module.exports = mongoose.model("notification", NotificationSchema);
