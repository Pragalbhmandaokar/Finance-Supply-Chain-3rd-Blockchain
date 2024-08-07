const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Balance = await ethers.getContractFactory("PaymentContract");
  const balance = await Balance.deploy();

  // Wait for the contract to be mined
  await balance.deployTransaction.wait(1); // Wait for 1 confirmation, adjust as necessary

  console.log("Storage contract deployed to:", balance.address);
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
