const express = require("express");
const scriptaccess = require("../controller/scriptaccessController");
const router = express.Router();

router.get("/eth", scriptaccess.addProduct);
router.get("/bnb", scriptaccess.addProductIdsToBNC);

router.post("/hyperledger", async (req, res) => {
  const { userId, chaincodeName, channelName, functionName, args } = req.body;

  const username = userId;
  try {
    const ccpPath = path.resolve(
      __dirname,
      "hyperleader",
      "config",
      "connection-profile-bank.json"
    );
    console.log(ccpPath);
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    const walletPath = path.join(process.cwd(), "bank-wallet");
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

    //   "-----BEGIN CERTIFICATE-----\nMIIB8jCCAZigAwIBAgIRANxd4D3sY0656NqOh8Rha0AwCgYIKoZIzj0EAwIwWDEL\nMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\ncmFuY2lzY28xDTALBgNVBAoTBE9yZzIxDTALBgNVBAMTBE9yZzIwHhcNMTcwNTA4\nMDkzMDM0WhcNMjcwNTA2MDkzMDM0WjBYMQswCQYDVQQGEwJVUzETMBEGA1UECBMK\nQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzENMAsGA1UEChMET3Jn\nMjENMAsGA1UEAxMET3JnMjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABDYy+qzS\nJ/8CMfhpBFhUhhz+7up4+lwjBWDSS01koszNh8camHTA8vS4ZsN+DZ2DRsSmRZgs\ntG2oogLLIdh6Z1CjQzBBMA4GA1UdDwEB/wQEAwIBpjAPBgNVHSUECDAGBgRVHSUA\nMA8GA1UdEwEB/wQFMAMBAf8wDQYDVR0OBAYEBAECAwQwCgYIKoZIzj0EAwIDSAAw\nRQIgWnMmH0yxAjub3qfzxQioHKQ8+WvUjAXm0ejId9Q+rDICIQDr30UCPj+SXzOb\nCu4psMMBfLujKoiBNdLE1KEpt8lN1g==\n-----END CERTIFICATE-----";
    //   "-----BEGIN PRIVATE KEY-----\r\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgf5MrfLYtOQ4mZ+yS\r\nwApAGaBDQmtaDeRSIfyb40wrRVWhRANCAAQXqbcVDWjxKr+KpoFaAm0T4whhDan7\r\nHA8QjEe8E+CwcOplTzW7VNxC1cBpD39HBDHc9HZbf3fvyCIh0mxUQWJ7\r\n-----END PRIVATE KEY-----\r\n";
    // //   "-----BEGIN CERTIFICATE-----\nMIICCjCCAbCgAwIBAgIUdPPhsgegmuS1tSbsZ74uqEtrEHMwCgYIKoZIzj0EAwIw\nezELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\nbiBGcmFuY2lzY28xHTAbBgNVBAoTFGJhbmsuc3VwcGx5Y2hhaW4uY29tMSAwHgYD\nVQQDExdjYS5iYW5rLnN1cHBseWNoYWluLmNvbTAeFw0yNDA2MTUxODU0MDBaFw0y\nNTA2MTUxOTAzMDBaMCExDzANBgNVBAsTBmNsaWVudDEOMAwGA1UEAxMFYWRtaW4w\nWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAQXqbcVDWjxKr+KpoFaAm0T4whhDan7\nHA8QjEe8E+CwcOplTzW7VNxC1cBpD39HBDHc9HZbf3fvyCIh0mxUQWJ7o2wwajAO\nBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQU0+UOk2zBJx12\nrI4CLtD/ALe6KoYwKwYDVR0jBCQwIoAgcad9hwSEfkf9hun/M96QZv5KB6s6cFoQ\n3y29d3GAI/EwCgYIKoZIzj0EAwIDSAAwRQIhAJnkVTtqsDfOg2PqCEgjkElUezW6\nu2McuoSVms2ovfDQAiAxrEd2nbQVfPYt82e6hyI6TySMPMPVyyBWG6oeEZcIPQ==\n-----END CERTIFICATE-----\n";
    console.log("here 1", identity);
    await gateway.connect(ccp, {
      wallet,
      identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    let network = await gateway.getNetwork("financesupplychain");

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
});
module.exports = router;
