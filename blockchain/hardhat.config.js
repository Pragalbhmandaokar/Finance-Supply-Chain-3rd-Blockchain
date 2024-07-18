require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.24",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    ganache: {
      url: "HTTP://127.0.0.1:7545",
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [
        "b2dab2312d4d942fe4418b6868300126295462250ac7af09817076f5457ef49b",
      ],
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/0059abc92ce6436d9e215ac3ad145e98",
      accounts: [
        "b2dab2312d4d942fe4418b6868300126295462250ac7af09817076f5457ef49b",
      ],
    },
    polygon: {
      url: "https://polygon-amoy.g.alchemy.com/v2/5csQE0QL2nb5twnWBDP8RidcUcb3EWji",
      accounts: [
        "b2dab2312d4d942fe4418b6868300126295462250ac7af09817076f5457ef49b",
      ],
    },
  },
};
