const { getCompanyCppPath } = require("../Utils/blockchainUtils");
const BaseService = require("./base_service");
const { Wallets } = require("fabric-network");

class BankService extends BaseService {
  constructor(opts) {
    super(opts, "company", "companyChain");
    this.logger = opts.logger;
    this.httpStatus = opts.httpStatus;
    this.path = opts.path;
  }

  async companyLogin(body) {
    const { username, companyName } = body;
    if (!username || !companyName) {
      this.logger.info("username or companyname is undefined");
      return {
        status: this.httpStatus.UNAUTHORIZED,
        message: "username or companyName is undefined",
      };
    }

    const walletPath = this.path.join(process.cwd(), "company-wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    let adminIdentity = await wallet.get(username);
    if (!adminIdentity) {
      this.logger.info(
        'An identity for the admin user "admin" does not exist in the wallet'
      );
      return {
        status: this.httpStatus.UNAUTHORIZED,
        message: "Sent Reset Password in your Registered Email",
      };
    }

    const result = await this.chain.getCompany({ username: companyName });

    return {
      data: adminIdentity,
      result: result,
      status: this.httpStatus.OK,
      message: "Authentication successful",
    };
  }
}

module.exports = BankService;
