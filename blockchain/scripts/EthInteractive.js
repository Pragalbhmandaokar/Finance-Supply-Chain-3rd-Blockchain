const { ethers } = require("hardhat");
const provider = new ethers.providers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/0059abc92ce6436d9e215ac3ad145e98"
);
const wallet = new ethers.Wallet(
  "b2dab2312d4d942fe4418b6868300126295462250ac7af09817076f5457ef49b",
  provider
);
const contractAddress = "0xb754ADdfcdF557e0839d73a124c483a3F687FCD1"; //"0x149d1d141622C3956ff3884fD3061e6949D1739a";
const contractABI =
  require("../artifacts/contracts/InvoiceContracts.sol/EnhancedInvoiceContract.json").abi;

async function getBncContract() {
  return new ethers.Contract(contractAddress, contractABI, wallet);
}
async function main() {
  try {
    const contract = await getBncContract();
    const tx = await contract.createInvoice(
      "0x761e2B53f8c1822cA61Ca0676FE5388F7191C751",
      1000
    );
    const receipt = await tx.wait();
    console.log("Value stored in the contract.", receipt);
    console.log("Block number:", receipt.blockNumber);

    const invoiceCount = await contract.getInvoiceCount();
    console.log(
      "Invoice count retrieved from the contract:",
      invoiceCount.toString()
    );
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
