const { ethers } = require("ethers");
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL_BNC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractABI = [
  {
    inputs: [],
    name: "retrieve",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "num",
        type: "uint256",
      },
    ],
    name: "store",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "addProductIds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getProductIds",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

//important
const contractAddress = "0xA4559A7F1E9FCeF421b21E83c0Cd136Ea5410FF4";

async function getBncContract() {
  return new ethers.Contract(contractAddress, contractABI, wallet);
}

async function mainBNB(productID) {
  try {
    console.log("Called");
    const BncContract = await getBncContract();
    const tx = await BncContract.addProductIds(productID);
    console.log(`Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`Transaction mined: ${receipt.transactionHash}`);

    const productCounter = await BncContract.getProductIds();
    console.log(`Product counter: ${productCounter}`);
    return {
      transactionHash: receipt.transactionHash,
      productCounter: productCounter.toString(),
    };
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

module.exports = { mainBNB, getBncContract };
