"use strict";
const BaseController = require("./BaseController");
const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const fs = require("fs");
const jwt = require("jsonwebtoken");

class BankController extends BaseController {
  constructor(opts) {
    super(opts, "BankController", "bankService", "financeChain");
    this.logger = opts.logger;
    this.path = opts.path;
  }

  async createBank(req, res, next) {
    this.logger.info("bankController Bank Register");
    try {
      const { body } = req;
      const dbResult = await this.service.createBank(body);
      res.send(dbResult);
    } catch (err) {
      this.logger.error(err.message);
      next(err);
    }
  }

  async login(req, res, next) {
    this.logger.info("bankController() - Bank Login");
    try {
      const { body } = req;
      console.log(body.bankId);
      const bank = await this.service.get(body.bankId);
      console.log(bank);
      if (!bank) {
        res.send("No Username found");
      }
      const token = jwt.sign({ username: bank._id }, "SECRET_KEY", {
        expiresIn: "1h",
      });
      res.send({ result: token, login_type: "BANK_LOGIN" });
    } catch (err) {
      this.logger.info("bankController() - Bank Login Error");
      res.send(err);
    }
  }

  async initBankUser(req, res, next) {
    this.logger.info("calling enroll Admin method");
    try {
      const { body } = req;
      const ccpPath = this.path.resolve(
        __dirname,
        "../../",
        "hyperleader",
        "config",
        "connection-profile-financial.json"
      );
      const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

      const caInfo = ccp.certificateAuthorities["ca.financial.supplychain.com"];
      const caTLSCACerts = caInfo.tlsCACerts.pem;

      const ca = new FabricCAServices(
        caInfo.url,
        {
          trustedRoots: caTLSCACerts,
          verify: false,
        },
        caInfo.caName
      );

      const walletPath = this.path.join(process.cwd(), "financial-wallet");

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
          mspId: "FinancialMSP",
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

          let orgMSPId = "FinancialMSP";

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

module.exports = BankController;
