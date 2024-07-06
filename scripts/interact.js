async function main(contractAddress = undefined) {
  const { ethers } = require("hardhat");
  const contractABI =
    require("../artifacts/contracts/Storage.sol/Storage.json").abi;

  const contractAddress = contractAddress
    ? contractAddress
    : "0x20877251B02cF06670f19e291d23247A097b7C1d";

  const provider = new ethers.providers.JsonRpcProvider(
    "https://data-seed-prebsc-1-s1.binance.org:8545/"
  );
  const signer = new ethers.Wallet(
    "b2dab2312d4d942fe4418b6868300126295462250ac7af09817076f5457ef49b",
    provider
  );

  const myContract = new ethers.Contract(contractAddress, contractABI, signer);

  const txResponse = await myContract.addProductIds(123);
  await txResponse.wait();
  console.log(`Transaction successful with hash: ${txResponse.hash}`);

  const number = await myContract.getMyNumber();
  console.log(`Number from contract: ${number}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
