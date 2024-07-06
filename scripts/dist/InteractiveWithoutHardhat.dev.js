"use strict";

var _require = require("ethers"),
    ethers = _require.ethers;

require("dotenv").config(); // Set up provider and wallet


var provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
var wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // Define your contract ABI and address

var contractABI = [{
  inputs: [{
    internalType: "string",
    name: "_name",
    type: "string"
  }, {
    internalType: "uint256",
    name: "_id",
    type: "uint256"
  }, {
    internalType: "string",
    name: "_date",
    type: "string"
  }],
  name: "addProductDetails",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function"
}, {
  inputs: [],
  name: "getProductCounter",
  outputs: [{
    internalType: "uint256",
    name: "",
    type: "uint256"
  }],
  stateMutability: "view",
  type: "function"
}];
var contractAddress = "0xD25096ea717F1B719d6001285b4E58b51D3352F3"; // Replace with your contract's address

function main() {
  var contract, args, productName, quantity, expirationDate, tx, receipt, productCounter;
  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          contract = new ethers.Contract(contractAddress, contractABI, wallet);
          args = process.argv.slice(2);

          if (args.length !== 3) {
            console.error("Usage: node interact.js <productName> <quantity> <expirationDate>");
            process.exit(1);
          }

          productName = args[0];
          quantity = ethers.BigNumber.from(args[1]);
          expirationDate = args[2]; // Send the transaction to add product details

          _context.next = 9;
          return regeneratorRuntime.awrap(contract.addProductDetails(productName, quantity, expirationDate));

        case 9:
          tx = _context.sent;
          console.log("Transaction sent: ".concat(tx.hash)); // Wait for the transaction to be mined

          _context.next = 13;
          return regeneratorRuntime.awrap(tx.wait());

        case 13:
          receipt = _context.sent;
          console.log("Transaction mined: ".concat(receipt.transactionHash)); // Retrieve the product counter

          _context.next = 17;
          return regeneratorRuntime.awrap(contract.getProductCounter());

        case 17:
          productCounter = _context.sent;
          console.log("Product counter: ".concat(productCounter.toString()));
          _context.next = 24;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](0);
          console.error("An error occurred:", _context.t0);

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 21]]);
}

main();