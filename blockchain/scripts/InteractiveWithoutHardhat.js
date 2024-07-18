const { ethers } = require("ethers");
const { mainBNB } = require("./InteractiveBnc");

require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractABI = [
  "event AssetAdded(uint assetId)",
  "function setMyNumber(uint _myNumber) public",
  "function getMyNumber() public view returns (uint)",
  "function addProductDetails(string memory _name, uint _id, string memory _date) public",
  "function getProductCounter() public view returns (uint)",
];

const contractAddress = "0xB0852A1B7B32F028f1ee5919edb3568b478A738d"; //"0xD25096ea717F1B719d6001285b4E58b51D3352F3";
async function getEthContract() {
  return new ethers.Contract(contractAddress, contractABI, wallet);
}

async function main(product, productId, productExpiryDate) {
  try {
    const productName = product;
    const quantity = productId;
    const expirationDate = productExpiryDate;
    const EthContract = await getEthContract();

    const tx = await EthContract.addProductDetails(
      productName,
      quantity,
      expirationDate
    );

    const receipt = await tx.wait();
    // console.log(`Transaction mined: ${receipt.transactionHash}`);

    const productCounter = await EthContract.getProductCounter();
    // console.log(`Product counter: ${productCounter.toString()}`);

    return {
      transactionHash: receipt.transactionHash,
      productCounter: productCounter.toString(),
    };
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

module.exports = { main, getEthContract };
