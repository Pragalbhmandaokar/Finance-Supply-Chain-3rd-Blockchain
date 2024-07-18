const BaseController = require("./BaseController");
const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const fs = require("fs");

class CompanyController extends BaseController {
  constructor(opts) {
    super(opts, "CompanyController", "companyService", "companyChain");
    this.logger = opts.logger;
    this.path = opts.path;
  }

  async createCompany(req, res, next) {
    this.logger.info(`${this.name} Company Registering`);
    try {
      const { body } = req;

      console.log(body.Name);
      const { result, transactionDetails } = await this.chain.createCompany(
        body
      );

      if (result == undefined) {
        res.send("Result is empty");
      }

      const UpdatedResult = {
        blockchain_network: "Binance",
        companyName: body.Name,
        transactionID: transactionDetails.transactionID,
      };

      const dbResult = await this.service.create(UpdatedResult);
      this.logger.info("Financial Request generated");
      res.send(dbResult);
    } catch (err) {
      this.logger.error(err.message);
      next(err);
    }
  }

  async companyLogin(req, res, next) {
    this.logger.info("Trying to login");
    try {
      const { body } = req;
      const loginResult = await this.service.companyLogin(body);
      this.logger.info("Login Successful");
      res.send(loginResult);
    } catch (err) {
      this.logger.error(err.message);
      res.send(err);
    }
  }
  async getCompanyById(req, res, next) {
    try {
      const { body } = req;
      this.logger.info("CompanyController - getCompanyByID()");
      const response = await this.chain.getCompany(body);
      this.logger.info("CompanyController - getCompanyByID() Completed");
      res.send(response);
    } catch (err) {
      this.logger.error(err.message);
      res.send(err);
    }
  }
  async getCompanyList(req, res, next) {
    try {
      this.logger.info("CompanyController - getCompanyList()");
      const response = await this.chain.getCompanyList();
      this.logger.info("CompanyController - getCompanyList() Completed");
      res.send(response);
    } catch (err) {
      this.logger.error(err.message);
      res.send(err);
    }
  }
  async initCompanyUser(req, res, next) {
    this.logger.info("calling enroll Admin method");
    try {
      const { body } = req;
      const ccpPath = this.path.resolve(
        __dirname,
        "../../",
        "hyperleader",
        "config",
        "connection-profile-company.json"
      );
      const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

      const caInfo = ccp.certificateAuthorities["ca.company.supplychain.com"];
      const caTLSCACerts = caInfo.tlsCACerts.pem;

      const ca = new FabricCAServices(
        caInfo.url,
        {
          trustedRoots: caTLSCACerts,
          verify: false,
        },
        caInfo.caName
      );

      const walletPath = this.path.join(process.cwd(), "company-wallet");

      const wallet = await Wallets.newFileSystemWallet(walletPath);

      let adminIdentity = await wallet.get("admin");

      if (!adminIdentity) {
        console.log(
          'An identity for the admin user "admin" does not exist in the wallet'
        );
        const enrollment = await ca.enroll({
          enrollmentID: "admin",
          enrollmentSecret: "adminpw",
        });
        const x509Identity = {
          credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
          },
          mspId: "CompanyMSP",
          type: "X.509",
        };
        await wallet.put("admin", x509Identity);
        console.log(
          'Successfully enrolled admin user "admin" and imported it into the wallet'
        );

        adminIdentity = await wallet.get("admin");

        const provider = wallet
          .getProviderRegistry()
          .getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, "admin");

        let secret;
        let privateKey;
        let { username } = body;
        try {
          // Register the user, enroll the user, and import the new identity into the wallet.

          secret = await ca.register(
            {
              enrollmentID: username,
              role: "client",
              maxEnrollments: -1,
            },
            adminUser
          );
          console.log("secret : ", secret);

          const enrollment = await ca.enroll({
            enrollmentID: username,
            enrollmentSecret: secret,
          });

          let orgMSPId = "CompanyMSP";

          privateKey = enrollment.key.toBytes();

          const x509Identity = {
            credentials: {
              certificate: enrollment.certificate,
              privateKey: privateKey,
            },
            mspId: orgMSPId,
            type: "X.509",
          };

          await wallet.put(username, x509Identity);
          console.log("user registered");
          res.send("User Registered");
        } catch (err) {
          this.logger.error(err.message);
          next(err);
        }
      }
    } catch (err) {
      this.logger.error(err.message);
      next(err);
    }
  }
}
module.exports = CompanyController;
