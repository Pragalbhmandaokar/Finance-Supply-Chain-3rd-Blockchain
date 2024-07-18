const {
  getNetworkDetails,
  getCompanyCppPath,
} = require("../Utils/blockchainUtils");

const { Gateway, Wallets } = require("fabric-network");

class CompanyChain {
  constructor(opts, modelName = "", chaincodeName = "Company") {
    this.logger = opts.logger;
    this.modelName = modelName;
    this.chaincodeName = getNetworkDetails(chaincodeName);
    this.path = opts.path;
  }
  async getCompany(body) {
    this.logger.info("getting company Request");

    const valuesArray = Object.values(body);

    try {
      const ccpPath = await getCompanyCppPath();

      const ccp = ccpPath;

      const walletPath = this.path.join(process.cwd(), "company-wallet");
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

      let network = await gateway.getNetwork("companychannel");

      const contract = network.getContract("companyChaincode");

      // Submit the specified transaction
      const transaction = contract.createTransaction("getCompany");
      const result = await transaction.submit(...valuesArray);

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
  async createCompany(body) {
    this.logger.info("creating company Request");
    body = {
      ...body,
      blockchain_network: "Binance",
      verified: true,
      sort_code: "726918",
      post_code: "LS12Y3",
    };

    const valuesArray = Object.values(body);

    try {
      const ccpPath = await getCompanyCppPath();

      const ccp = ccpPath;

      const walletPath = this.path.join(process.cwd(), "company-wallet");
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

      let network = await gateway.getNetwork("companychannel");

      this.logger.info("here");
      const contract = network.getContract("companyChaincode");

      // Submit the specified transaction
      const transaction = contract.createTransaction("registerCompany");
      const result = await transaction.submit(...valuesArray);

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

  async getCompanyList() {
    try {
      const ccpPath = await getCompanyCppPath();

      const ccp = ccpPath;

      const walletPath = this.path.join(process.cwd(), "company-wallet");
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

      let network = await gateway.getNetwork("companychannel");

      this.logger.info("here");
      const contract = network.getContract("companyChaincode");

      // Submit the specified transaction
      const response = await contract.evaluateTransaction("getCompanyList");
      console.log("Company list retrieved:", response);

      return {
        result: response.toString(),
      };
    } catch (err) {
      console.error(`Failed to submit transaction: ${err}`);
      return err.toString();
    }
  }
}

module.exports = CompanyChain;
