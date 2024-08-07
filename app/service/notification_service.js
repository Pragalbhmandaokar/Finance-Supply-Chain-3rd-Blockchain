const BaseService = require("./base_service");

class NotificationService extends BaseService {
  constructor(opts) {
    console.log("called");
    super(opts, "notification");
    this.logger = opts.logger;
  }

  async createNotification(body) {
    const { invoiceId, SupplierId, BuyerId, NotificationType } = body;

    this.logger.info("bankService register bank");
    const notificationBody = {
      NotificationType: NotificationType,
      InvoiceId: invoiceId,
      SupplierId: SupplierId,
      BuyerId: BuyerId,
    };
    const result = await this.databaseService.create(
      this.modelName,
      notificationBody
    );
    this.logger.info(`${this.modelName} created successfully`);
    return result.toJSON();
  }
}

module.exports = NotificationService;
