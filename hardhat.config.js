require('hardhat-deploy');
require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");
const fs = require('fs');
const projectId = "33d1755d8440ba0e2dd32cbd";
const privateKey = fs.readFileSync('./.secret').toString();
const apiKeyForEtherscan = "PJ2V5H4XH4P3PYXJE5JUM6VQRPRHQ56HDV";
// const apiKeyForBscscan = "PJ2V5H4XH4P3PYXJE5JUM6VQRPRHQ56HDV";
module.exports = {
  // defaultNetwork: "rinkedby",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // chainId: 4 //ethereum
      chainId: 1337, //ethereum
      // chainId: 97, //ethereum
    },
    polygonmainnet: {
      url: `https://speedy-nodes-nyc.moralis.io/${projectId}/polygon/mainnet`,
      accounts: [privateKey]
    },
    mumbai: {
      url: `https://speedy-nodes-nyc.moralis.io/${projectId}/polygon/mumbai`,
      accounts: [privateKey]
    },
    ethermainnet: {
      url: `https://speedy-nodes-nyc.moralis.io/${projectId}/eth/mainnet`,
      accounts: [privateKey]
    },
    kovan: {
      url: `https://speedy-nodes-nyc.moralis.io/${projectId}/eth/kovan`,
      accounts: [privateKey]
    },
    rinkeby: {
      url: `https://speedy-nodes-nyc.moralis.io/${projectId}/eth/rinkeby`,
      accounts: [privateKey]
    } ,
    bscmainnet: {
      url: `https://speedy-nodes-nyc.moralis.io/${projectId}/bsc/mainnet`,
      accounts: [privateKey]
    },
    bsctestnet: {
      url: `https://speedy-nodes-nyc.moralis.io/${projectId}/bsc/testnet`,
      accounts: [privateKey]
    }
  },
  paths:{
    sources: "./contracts",
    artifacts: "./artifacts"
  },
  etherscan: {
    apiKey: apiKeyForEtherscan
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4"
      },
      {
        version: "0.8.0"
      }
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 800
      }
    }
  },
  // solidity: "0.8.4",
};
