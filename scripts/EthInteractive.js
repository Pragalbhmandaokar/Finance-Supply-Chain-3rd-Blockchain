async function main() {
  const { ethers } = require("hardhat");

  const contractAddress = "0x05D79479c8c1c30Bab7D528369DB09084520634b";
  const contractABI =
    require("../artifacts/contracts/Storage.sol/Storage.json").abi;

  const signer = (await ethers.getSigners())[0];

  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  const tx = await contract.store(1000);
  await tx.wait();
  console.log("Value stored in the contract.");

  const result = await contract.retrieve();
  console.log("Value retrieved from the contract:", result.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
