const { assert } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic NFT Unit Tests", function () {
          let flyingPeopleDNFT, deployer

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["flyingPeopleDNFT"])
              flyingPeopleDNFT = await ethers.getContract("FlyingPeopleDNFT")
          })

          //test01
          describe("Construtor", () => {
              it("Initializes the NFT Correctly.", async () => {
                  const name = await flyingPeopleDNFT.name()
                  const symbol = await flyingPeopleDNFT.symbol()
                  assert.equal(name, "FlyingPeopleDNFT")
                  assert.equal(symbol, "FPDNFT")
              })
          })
      })
