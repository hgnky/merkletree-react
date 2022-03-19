require("@nomiclabs/hardhat-waffle");

const privateKey = "b1859113c16dbac1d5e10df367b2cb5f521232ddc50eed195d780057ab9cd79b";
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // chainId: 1337,
      chainId: 97
    },
    bsctestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      accounts: [privateKey]
    },
  },
  paths: {
    sources: "./contracts",
    artifacts: "./src/artifacts"
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
