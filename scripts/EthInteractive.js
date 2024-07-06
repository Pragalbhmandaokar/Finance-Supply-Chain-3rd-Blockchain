let productName;
let quantity;
let expirationDate;
async function main() {
  try {
    const { ethers } = require("hardhat");

    const contractAddress = "0x24a557D71Ea75FCEbeeE31ACe2e0d879f0486410";
    const contractABI =
      require("../artifacts/contracts/BnbContract.sol/MyContract.json").abi;

    const signer = (await ethers.getSigners())[0];

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const tx = await contract.addProductDetails(
      productName,
      quantity,
      expirationDate
    );
    const receipt = await tx.wait();
    console.log("Value stored in the contract.");
    console.log("Block number:", receipt.blockNumber);
    const result = await contract.getProductCounter();
    console.log("Value retrieved from the contract:", result.toString());
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
if (args.length !== 3) {
  console.error(
    "Usage: npx hardhat run scripts/EthInteractive.js <productName> <quantity> <expirationDate> --network <network>"
  );
  process.exit(1);
}
productName = process.argv[2];
quantity = process.argv[3];
expirationDate = process.argv[4];
console.log(process.argv[2], process.argv[3], process.argv[4]);
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
