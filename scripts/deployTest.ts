import { Contract, ContractFactory } from "ethers";
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import config from "./config.json";
import { waitSeconds } from "./utils";

async function main(): Promise<void> {
  // Hardhat always runs the compile task when running scripts through it.
  // If this runs in a standalone fashion you may want to call compile manually
  // to make sure everything is compiled
  // await run("compile");

  // We get the contract to deploy
  const params = config.velasTest;

  // construction params

  const RandomNumberGenerator: ContractFactory = await ethers.getContractFactory("RandomNumberGenerator");
  const randomNumberGenerator: Contract = await RandomNumberGenerator.deploy();
  await randomNumberGenerator.deployed();

  console.log("RandomNumberGenerator deployed to:", randomNumberGenerator.address);

  await randomNumberGenerator.setTruster(params.randomTruster, true);

  console.log("Random truster is set to", params.randomTruster);

  await waitSeconds(10);

  const AstroSwapLottery: ContractFactory = await ethers.getContractFactory("AstroSwapLottery");
  const astroSwapLottery: Contract = await AstroSwapLottery.deploy(params.astro, randomNumberGenerator.address);
  await astroSwapLottery.deployed();

  console.log("AstroSwapLottery deployed to:", astroSwapLottery.address);

  await randomNumberGenerator.setLotteryAddress(astroSwapLottery.address);

  await astroSwapLottery.setOperatorAndTreasuryAndInjectorAddresses(params.operator, params.treasury, params.injector);
  console.log("AstroSwapLottery operator is set to", params.operator);
  console.log("AstroSwapLottery treasury is set to", params.treasury);
  console.log("AstroSwapLottery injector is set to", params.injector);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
