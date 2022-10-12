// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { spawn } from "child_process";
import { ethers } from "hardhat";

const deploy = async (name: string, ...args: any) => {
  console.log("Deploying...")
  const Registry = await ethers.getContractFactory(name);
  const registry = await Registry.deploy(...args);
  await registry.deployed();
  const [deployer] = await ethers.getSigners();
  // Saving the info to be logged in the table (deployer address)
  var deployerLog = { Label: "Deploying Address", Info: deployer.address };
  // Saving the info to be logged in the table (deployer address)
  var deployerBalanceLog = {
      Label: "Deployer Balance",
      Info: (await deployer.getBalance()).toString()
  };
  var ContractLog = { Label: `Deployed ${name} Address`, Info: registry.address };

  console.table([
    deployerLog,
    deployerBalanceLog,
    ContractLog
  ]);

  return registry;
};

async function deployProc() {
  const blink = await deploy("WidgetsFactory");
}

deployProc();
