const ethers = require("ethers");
class InvoiceChain {
  constructor(opts, modelName = "", chaincodeName = "Invoice") {
    console.log(chaincodeName);
    this.logger = opts.logger;
    this.modelName = modelName;
    this.path = opts.path;
  }

  async getContract(privateKey) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://sepolia.infura.io/v3/0059abc92ce6436d9e215ac3ad145e98"
      );

      const wallet = new ethers.Wallet(privateKey, provider);
      const contractABI = require("../../blockchain/artifacts/contracts/InvoiceContracts.sol/EnhancedInvoiceContract.json");
      //important
      const contractAddress = "0xb754ADdfcdF557e0839d73a124c483a3F687FCD1";
      const BncContract = await new ethers.Contract(
        contractAddress,
        contractABI.abi,
        wallet
      );
      return BncContract;
    } catch (err) {
      console.log(err);
    }
  }

  async createInvoice(body) {
    this.logger.info("InvoiceChain() - create Invoice");
    try {
      const { buyerId, amount, privateKey } = body;
      const BncContract = await this.getContract(privateKey);
      const tx = await BncContract.createInvoice(buyerId, amount);
      const receipt = await tx.wait();
      this.logger.info(
        `Transaction has been submitted, result is: ${receipt.transactionHash}`
      );
      return {
        transactionId: receipt.transactionHash,
      };
    } catch (error) {
      console.error("An error occurred:", error);
      return error.toString();
    }
  }

  async getInvoices(body) {
    this.logger.info("InvoiceChain() - get Invoices");
    try {
      const { privateKey } = body;
      const BncContract = await this.getContract(privateKey);
      const tx = await BncContract.getAllInvoices();

      console.log(tx);
      this.logger.info(
        `Transaction has been submitted, result is: ${tx.length}`
      );
      return {
        result: tx,
      };
    } catch (error) {
      console.error("An error occurred:", error);
      return error.toString();
    }
  }

  async approveInvoice(body) {
    this.logger.info("InvoiceChain() - approve Invoice");
    try {
      const { invoiceId, privateKey } = body;
      const BncContract = await this.getContract(privateKey);
      const tx = await BncContract.approveInvoice(invoiceId);
      const receipt = await tx.wait();
      this.logger.info(
        `Transaction has been submitted, result is: ${receipt.transactionHash}`
      );

      return {
        transactionId: receipt.transactionHash,
      };
    } catch (err) {
      console.error("An error occurred:", err);
      return err.toString();
    }
  }

  async payInvoice(body) {
    this.logger.info("InvoiceChain() - approve Invoice");
    try {
      const { invoiceId } = body;
      const BncContract = await this.getContract(invoiceId);
      const tx = await BncContract.payInvoice();
      const receipt = await tx.wait();
      this.logger.info(
        `Transaction has been submitted, result is: ${receipt.transactionHash}`
      );

      return {
        transactionId: receipt.transactionHash,
      };
    } catch (err) {
      console.error("An error occurred:", err);
      return err.toString();
    }
  }
}

module.exports = InvoiceChain;
