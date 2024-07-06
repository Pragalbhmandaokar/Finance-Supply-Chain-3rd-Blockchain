const { Gateway, Wallets } = require("fabric-network");

const path = require("path");
const fs = require("fs");

const createBank = async (req, res) => {
  const { userId, chaincodeName, channelName, functionName, args } = req.body;

  const username = userId;
  try {
    const ccpPath = path.resolve(
      __dirname,
      "../../",
      "hyperleader",
      "config",
      "connection-profile-financial.json"
    );

    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    const walletPath = path.join(process.cwd(), "financial-wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get("admin");

    if (!identity) {
      console.log(
        'An identity for the admin user "admin" does not exist in the wallet'
      );
      console.log("Run the enrollAdmin.js application before retrying");
      return;
    }

    const gateway = new Gateway();

    console.log("here 1", identity);
    await gateway.connect(ccp, {
      wallet,
      identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    let network = await gateway.getNetwork("financialchannel");

    console.log("here");
    const contract = network.getContract("financeChaincode");

    // Submit the specified transaction
    const transaction = contract.createTransaction(functionName);
    const result = await transaction.submit(...args);

    console.log(
      `Transaction has been submitted, result is: ${
        (result.toString(), transaction.getTransactionId())
      }`
    );

    res.status(200).json({ result: result.toString() });
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    res.status(500).json({ error: error.toString() });
  }
};

module.exports = { createBank };
