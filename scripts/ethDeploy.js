async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Balance = await ethers.getContractFactory("Storage");
  const balance = await Balance.deploy();

  console.log("Storage contract deployed to:", balance.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
