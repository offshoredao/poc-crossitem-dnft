const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------")
    arguments = ["FlyingPeopleDNFT", "FPDNFT", deployer, 0, deployer]
    const flyingPeopleDNFT = await deploy("FlyingPeopleDNFT", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(flyingPeopleDNFT)
}

module.exports.tags = ["all", "flyingPeopleDNFT", "main"]
