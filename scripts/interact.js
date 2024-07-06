async function main() {
  // Importing ethers from Hardhat environment
  const { ethers } = require("hardhat");

  // Your contract's ABI
  const contractABI =
    require("../artifacts/contracts/BnbContract.sol/MyContract.json").abi;

  // The address your contract is deployed at
  const contractAddress = "0xbdc814E7c13823C9c04d81Efca6d719a5dCf6910";

  // Setup provider and signer
  const provider = new ethers.providers.JsonRpcProvider(
    "https://data-seed-prebsc-1-s1.binance.org:8545/"
  );
  const signer = new ethers.Wallet(
    "b2dab2312d4d942fe4418b6868300126295462250ac7af09817076f5457ef49b",
    provider
  );

  // Connecting to the contract
  const myContract = new ethers.Contract(contractAddress, contractABI, signer);

  // Example of calling a 'set' function that writes data
  const txResponse = await myContract.setMyNumber(123); // Change 'setMyNumber' and '123' based on your contract's function and data needs
  await txResponse.wait();
  console.log(`Transaction successful with hash: ${txResponse.hash}`);

  // Example of calling a 'get' function that reads data
  const number = await myContract.getMyNumber(); // Change 'getMyNumber' based on your contract's function
  console.log(`Number from contract: ${number}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
