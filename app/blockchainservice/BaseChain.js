"use strick";

const { ethers } = require("ethers");

class BaseChain {
  constructor(opts, modelName = "") {
    this.logger = opts.logger;
    this.modelName = modelName;

    this.path = opts.path;
  }

  async getTransactionDetails(txHash) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://sepolia.infura.io/v3/0059abc92ce6436d9e215ac3ad145e98"
      );

      // Get the transaction details using the transaction hash

      const transaction = await provider.getTransaction(txHash);
      console.log("Transaction Details:", transaction);

      if (transaction) {
        // Get the transaction receipt
        const receipt = await provider.getTransactionReceipt(txHash);
        console.log("Transaction Receipt:", receipt);

        // Get the sender's (previous) address
        const senderAddress = transaction.from;
        console.log("Sender (Previous) Address:", senderAddress);
      } else {
        console.log("Transaction not found");
      }
    } catch (error) {
      console.error("Error getting transaction details:", error);
    }
  }
}

module.exports = BaseChain;
