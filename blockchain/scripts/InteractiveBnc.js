const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  "https://data-seed-prebsc-2-s1.binance.org:8545/"
);
const wallet = new ethers.Wallet(
  "b2dab2312d4d942fe4418b6868300126295462250ac7af09817076f5457ef49b",
  provider
);

const contractABI = require("../artifacts/contracts/InvoiceContracts.sol/EnhancedInvoiceContract.json");
//important
const contractAddress = "0xb754ADdfcdF557e0839d73a124c483a3F687FCD1"; //"0x3fD72D95Bdf31f9061cDec703D3D708422a5218c";

async function getBncContract() {
  return new ethers.Contract(contractAddress, contractABI.abi, wallet);
}

async function mainBNB() {
  try {
    console.log("Called");
    const BncContract = await getBncContract();

    const tx = await BncContract.createInvoice(
      "0x761e2B53f8c1822cA61Ca0676FE5388F7191C751",
      1000,
      {
        gasPrice: ethers.utils.parseUnits("100", "gwei"), // Adjust the gas price as needed
        gasLimit: ethers.utils.hexlify(1000000), // Adjust the gas limit as needed
      }
    );
    console.log(`Transaction sent: ${tx.hash}`);

    // Monitor the transaction status asynchronously
    await tx
      .wait()
      .then((receipt) => {
        console.log(`Transaction mined: ${receipt.transactionHash}`);

        BncContract.getAllInvoices().then((productCounter) => {
          console.log(`Product counter: ${productCounter}`);
          return {
            transactionHash: receipt.transactionHash,
            productCounter: productCounter.toString(),
          };
        });
      })
      .catch((error) => {
        console.error(
          "An error occurred while waiting for the transaction to be mined:",
          error
        );
      });

    // Continue with other logic if needed
    console.log("Transaction sent, waiting for confirmation...");
    return;
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

module.exports = { mainBNB, getBncContract };
