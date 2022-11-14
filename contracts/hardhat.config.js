require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {},
        goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
        },
        localhost: {
            url: "http://localhost:8545",
            chainId: 31337,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer.
            // Note though that depending on how hardhat network are configured,
            // the account 0 on one network can be different than on another
        },
    },
    settings: {
        optimizer: {
            enabled: true,
            runs: 200,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.11",
            },
            {
                version: "0.6.6",
            },
        ],
    },
}
