const {
  getNetworkDetails,
  getFinancialCppPath,
} = require("../Utils/blockchainUtils");

const { Gateway, Wallets } = require("fabric-network");

class FinanceChain {
  constructor(opts, modelName = "", chaincodeName = "Finance") {
    this.logger = opts.logger;
    this.modelName = modelName;
    this.chaincodeName = getNetworkDetails(chaincodeName);
    this.path = opts.path;
  }

  async financialRequesting(body) {
    this.logger.info("creating financial Request");
    const { functionName, args } = body;
    try {
      const ccpPath = await getFinancialCppPath();

      const ccp = ccpPath;

      const walletPath = this.path.join(process.cwd(), "financial-wallet");
      const wallet = await Wallets.newFileSystemWallet(walletPath);

      const identity = await wallet.get("admin");

      if (!identity) {
        this.logger.info(
          'An identity for the admin user "admin" does not exist in the wallet'
        );
        this.logger.info("Run the enrollAdmin.js application before retrying");
        return;
      }

      const gateway = new Gateway();

      await gateway.connect(ccp, {
        wallet,
        identity,
        discovery: { enabled: true, asLocalhost: true },
      });

      let network = await gateway.getNetwork("financialchannel");

      this.logger.info("here");
      const contract = network.getContract("financeChaincode");

      // Submit the specified transaction
      const transaction = contract.createTransaction(functionName);
      const result = await transaction.submit(...args);

      this.logger.info(
        `Transaction has been submitted, result is: ${
          (result.toString(), transaction.getTransactionId())
        }`
      );

      return {
        result: result.toString(),
        transactionDetails: { transactionID: transaction.getTransactionId() },
      };
    } catch (error) {
      console.error(`Failed to submit transaction: ${error}`);
      return error.toString();
    }
  }
}

module.exports = FinanceChain;
