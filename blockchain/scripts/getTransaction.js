const { ethers } = require("ethers");

// Connect to an Ethereum node
const provider = new ethers.providers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/0059abc92ce6436d9e215ac3ad145e98"
);

// Block hash
const blockHash =
  "0x78c9f3fd52b19279b4f6850f23d8a824f15522154396e0bab45e364bfab27459";

// Function to fetch all transactions from a specific block
async function getBlockTransactions(blockHash) {
  try {
    // Fetch the block with transactions
    const blockWithTransactions = await provider.getBlockWithTransactions(
      blockHash
    );

    // Display information
    console.log(
      `Total Transactions in Block: ${blockWithTransactions.transactions.length}`
    );
    blockWithTransactions.transactions.forEach((tx) => {
      console.log(`Transaction Hash: ${tx.hash}`);
      console.log(
        `From: ${tx.from} To: ${tx.to} Value: ${ethers.utils.formatEther(
          tx.value
        )} ETH`
      );
    });
  } catch (error) {
    console.error("Error fetching block transactions:", error);
  }
}

// Execute the function
// getBlockTransactions(blockHash);

// Function to get the latest block hash
async function getLatestBlockHash() {
  try {
    const latestBlock = await provider.getBlock("latest");
    console.log(`Latest Block Hash: ${latestBlock.hash}`);
  } catch (error) {
    console.error("Error fetching latest block hash:", error);
  }
}

// Function to get a specific block hash by block number
async function getBlockHashByNumber(blockNumber) {
  try {
    const block = await provider.getBlock(blockNumber);
    console.log(`Block Hash for Block Number ${blockNumber}: ${block.hash}`);
  } catch (error) {
    console.error("Error fetching block hash:", error);
  }
}

// // Call the functions
// getLatestBlockHash();
// getBlockHashByNumber(6442545); // Replace with your block number

// Smart contract address
const contractAddress = "0xb754ADdfcdF557e0839d73a124c483a3F687FCD1";

// Function to fetch all transactions from a specific block and filter by contract address
async function getContractTransactions(blockHash, contractAddress) {
  try {
    console.log(
      "--------------------------------------------------------------------------------------------"
    );
    // Fetch the block with transactions
    const blockWithTransactions = await provider.getBlockWithTransactions(
      blockHash
    );

    // Check if the block was found
    if (!blockWithTransactions) {
      console.log("Block not found");
      return;
    }

    // Filter transactions involving the contract address
    const contractTransactions = blockWithTransactions.transactions.filter(
      (tx) => tx.to === contractAddress || tx.from === contractAddress
    );

    // Display filtered transactions
    console.log(
      `Total Transactions involving ${contractAddress}: ${contractTransactions.length}`
    );
    contractTransactions.forEach((tx) => {
      console.log(`Transaction Hash: ${tx.hash}`);
      console.log(
        `From: ${tx.from} To: ${tx.to} Value: ${ethers.utils.formatEther(
          tx.value
        )} ETH`
      );
    });
  } catch (error) {
    console.error("Error fetching block transactions:", error);
  }
}

// Execute the function
getContractTransactions(blockHash, contractAddress);
