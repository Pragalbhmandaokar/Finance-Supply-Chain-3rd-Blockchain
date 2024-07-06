"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var bodyParser = require("body-parser");

var express = require("express");

var serviceLocator = require("./app/lib/service_locator");

var httpContext = require("express-http-context");

var router = require("./app/router/scriptaccess.route");

var _require = require("./scripts/InteractiveBnc"),
    BncContract = _require.BncContract;

var _require2 = require("./scripts/InteractiveBnc"),
    mainBNB = _require2.mainBNB;

var _require3 = require("./scripts/InteractiveWithoutHardhat"),
    getEthContract = _require3.getEthContract;

var logger = serviceLocator.get("logger");

var _require4 = require("fabric-network"),
    Gateway = _require4.Gateway,
    Wallets = _require4.Wallets;

var path = require("path");

var fs = require("fs");

var FabricCAServices = require("fabric-ca-client");

var server = express();
server.use(bodyParser.json());
server.use(httpContext.middleware);
server.use(router);

function main() {
  var ccpPath, ccp, caInfo, caTLSCACerts, ca, walletPath, wallet, adminIdentity, enrollment, x509Identity, provider, adminUser, secret, privateKey, username, _enrollment, orgMSPId, _x509Identity;

  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("calling enroll Admin method");
          _context.prev = 1;
          ccpPath = path.resolve(__dirname, "hyperleader", "config", "connection-profile-bank.json");
          ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
          caInfo = ccp.certificateAuthorities["ca.bank.supplychain.com"];
          caTLSCACerts = caInfo.tlsCACerts.pem;
          console.log(caInfo);
          ca = new FabricCAServices(caInfo.url, {
            trustedRoots: caTLSCACerts,
            verify: false
          }, caInfo.caName);
          walletPath = path.join(process.cwd(), "bank-wallet");
          console.log(walletPath);
          _context.next = 12;
          return regeneratorRuntime.awrap(Wallets.newFileSystemWallet(walletPath));

        case 12:
          wallet = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(wallet.get("admin"));

        case 15:
          adminIdentity = _context.sent;
          console.log(adminIdentity);

          if (adminIdentity) {
            _context.next = 53;
            break;
          }

          console.log('An identity for the admin user "admin" does not exist in the wallet');
          _context.next = 21;
          return regeneratorRuntime.awrap(ca.enroll({
            enrollmentID: "admin",
            enrollmentSecret: "adminpw"
          }));

        case 21:
          enrollment = _context.sent;
          x509Identity = {
            credentials: {
              certificate: enrollment.certificate,
              privateKey: enrollment.key.toBytes()
            },
            mspId: "BankMSP",
            type: "X.509"
          };
          _context.next = 25;
          return regeneratorRuntime.awrap(wallet.put("admin", x509Identity));

        case 25:
          console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
          _context.next = 28;
          return regeneratorRuntime.awrap(wallet.get("admin"));

        case 28:
          adminIdentity = _context.sent;
          provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
          _context.next = 32;
          return regeneratorRuntime.awrap(provider.getUserContext(adminIdentity, "admin"));

        case 32:
          adminUser = _context.sent;
          username = "pam2";
          _context.prev = 34;
          _context.next = 37;
          return regeneratorRuntime.awrap(ca.register({
            enrollmentID: username,
            role: "client",
            maxEnrollments: -1
          }, adminUser));

        case 37:
          secret = _context.sent;
          console.log("secret : ", secret);
          _context.next = 41;
          return regeneratorRuntime.awrap(ca.enroll({
            enrollmentID: username,
            enrollmentSecret: secret
          }));

        case 41:
          _enrollment = _context.sent;
          orgMSPId = "BankMSP";
          privateKey = _enrollment.key.toBytes();
          _x509Identity = {
            credentials: {
              certificate: _enrollment.certificate,
              privateKey: privateKey
            },
            mspId: orgMSPId,
            type: "X.509"
          };
          _context.next = 47;
          return regeneratorRuntime.awrap(wallet.put(username, _x509Identity));

        case 47:
          console.log("user registered");
          _context.next = 53;
          break;

        case 50:
          _context.prev = 50;
          _context.t0 = _context["catch"](34);
          console.log(_context.t0);

        case 53:
          _context.next = 58;
          break;

        case 55:
          _context.prev = 55;
          _context.t1 = _context["catch"](1);
          console.log(_context.t1);

        case 58:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 55], [34, 50]]);
}

main();
server.post("/submit", function _callee(req, res) {
  var _req$body, userId, chaincodeName, channelName, functionName, args, username, ccpPath, ccp, walletPath, wallet, identity, gateway, network, contract, transaction, result;

  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, userId = _req$body.userId, chaincodeName = _req$body.chaincodeName, channelName = _req$body.channelName, functionName = _req$body.functionName, args = _req$body.args;
          username = userId;
          _context2.prev = 2;
          ccpPath = path.resolve(__dirname, "hyperleader", "config", "connection-profile-bank.json");
          console.log(ccpPath);
          ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
          walletPath = path.join(process.cwd(), "bank-wallet");
          _context2.next = 9;
          return regeneratorRuntime.awrap(Wallets.newFileSystemWallet(walletPath));

        case 9:
          wallet = _context2.sent;
          _context2.next = 12;
          return regeneratorRuntime.awrap(wallet.get("admin"));

        case 12:
          identity = _context2.sent;

          if (identity) {
            _context2.next = 17;
            break;
          }

          console.log('An identity for the admin user "admin" does not exist in the wallet');
          console.log("Run the enrollAdmin.js application before retrying");
          return _context2.abrupt("return");

        case 17:
          gateway = new Gateway(); //   "-----BEGIN CERTIFICATE-----\nMIIB8jCCAZigAwIBAgIRANxd4D3sY0656NqOh8Rha0AwCgYIKoZIzj0EAwIwWDEL\nMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG\ncmFuY2lzY28xDTALBgNVBAoTBE9yZzIxDTALBgNVBAMTBE9yZzIwHhcNMTcwNTA4\nMDkzMDM0WhcNMjcwNTA2MDkzMDM0WjBYMQswCQYDVQQGEwJVUzETMBEGA1UECBMK\nQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzENMAsGA1UEChMET3Jn\nMjENMAsGA1UEAxMET3JnMjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABDYy+qzS\nJ/8CMfhpBFhUhhz+7up4+lwjBWDSS01koszNh8camHTA8vS4ZsN+DZ2DRsSmRZgs\ntG2oogLLIdh6Z1CjQzBBMA4GA1UdDwEB/wQEAwIBpjAPBgNVHSUECDAGBgRVHSUA\nMA8GA1UdEwEB/wQFMAMBAf8wDQYDVR0OBAYEBAECAwQwCgYIKoZIzj0EAwIDSAAw\nRQIgWnMmH0yxAjub3qfzxQioHKQ8+WvUjAXm0ejId9Q+rDICIQDr30UCPj+SXzOb\nCu4psMMBfLujKoiBNdLE1KEpt8lN1g==\n-----END CERTIFICATE-----";
          //   "-----BEGIN PRIVATE KEY-----\r\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgf5MrfLYtOQ4mZ+yS\r\nwApAGaBDQmtaDeRSIfyb40wrRVWhRANCAAQXqbcVDWjxKr+KpoFaAm0T4whhDan7\r\nHA8QjEe8E+CwcOplTzW7VNxC1cBpD39HBDHc9HZbf3fvyCIh0mxUQWJ7\r\n-----END PRIVATE KEY-----\r\n";
          // //   "-----BEGIN CERTIFICATE-----\nMIICCjCCAbCgAwIBAgIUdPPhsgegmuS1tSbsZ74uqEtrEHMwCgYIKoZIzj0EAwIw\nezELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\nbiBGcmFuY2lzY28xHTAbBgNVBAoTFGJhbmsuc3VwcGx5Y2hhaW4uY29tMSAwHgYD\nVQQDExdjYS5iYW5rLnN1cHBseWNoYWluLmNvbTAeFw0yNDA2MTUxODU0MDBaFw0y\nNTA2MTUxOTAzMDBaMCExDzANBgNVBAsTBmNsaWVudDEOMAwGA1UEAxMFYWRtaW4w\nWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAQXqbcVDWjxKr+KpoFaAm0T4whhDan7\nHA8QjEe8E+CwcOplTzW7VNxC1cBpD39HBDHc9HZbf3fvyCIh0mxUQWJ7o2wwajAO\nBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQU0+UOk2zBJx12\nrI4CLtD/ALe6KoYwKwYDVR0jBCQwIoAgcad9hwSEfkf9hun/M96QZv5KB6s6cFoQ\n3y29d3GAI/EwCgYIKoZIzj0EAwIDSAAwRQIhAJnkVTtqsDfOg2PqCEgjkElUezW6\nu2McuoSVms2ovfDQAiAxrEd2nbQVfPYt82e6hyI6TySMPMPVyyBWG6oeEZcIPQ==\n-----END CERTIFICATE-----\n";

          console.log("here 1", identity);
          _context2.next = 21;
          return regeneratorRuntime.awrap(gateway.connect(ccp, {
            wallet: wallet,
            identity: identity,
            discovery: {
              enabled: true,
              asLocalhost: true
            }
          }));

        case 21:
          _context2.next = 23;
          return regeneratorRuntime.awrap(gateway.getNetwork("financesupplychain"));

        case 23:
          network = _context2.sent;
          console.log("here");
          contract = network.getContract("financeChaincode"); // Submit the specified transaction

          transaction = contract.createTransaction(functionName);
          _context2.next = 29;
          return regeneratorRuntime.awrap(transaction.submit.apply(transaction, _toConsumableArray(args)));

        case 29:
          result = _context2.sent;
          console.log("Transaction has been submitted, result is: ".concat((result.toString(), transaction.getTransactionId())));
          res.status(200).json({
            result: result.toString()
          });
          _context2.next = 38;
          break;

        case 34:
          _context2.prev = 34;
          _context2.t0 = _context2["catch"](2);
          console.error("Failed to submit transaction: ".concat(_context2.t0));
          res.status(500).json({
            error: _context2.t0.toString()
          });

        case 38:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 34]]);
});

function interactiveScript() {
  var EthContract;
  return regeneratorRuntime.async(function interactiveScript$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(getEthContract());

        case 3:
          EthContract = _context4.sent;
          EthContract.on("AssetAdded", function _callee2(newProductId) {
            var result;
            return regeneratorRuntime.async(function _callee2$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.prev = 0;
                    console.log("Trigger Called");
                    _context3.next = 4;
                    return regeneratorRuntime.awrap(mainBNB(newProductId));

                  case 4:
                    result = _context3.sent;
                    console.log(result);
                    _context3.next = 11;
                    break;

                  case 8:
                    _context3.prev = 8;
                    _context3.t0 = _context3["catch"](0);
                    console.error("Error in /addProduct:", _context3.t0); //res.status(500).json({ err: "Internal server error" });

                  case 11:
                  case "end":
                    return _context3.stop();
                }
              }
            }, null, null, [[0, 8]]);
          });
          _context4.next = 10;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.error("error in creating interactive script", _context4.t0);

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
}

interactiveScript();
server.listen(3000, function () {
  return console.log("Server running on http://localhost:3000");
});