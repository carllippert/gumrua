import hre, { ethers } from "hardhat";
import {
  ConfigProperty,
  setDeploymentProperty,
} from "../.deployment/deploymentManager";

async function main() {
  const network = hre.network.name;
  console.log("Network:", network);

  const Storage = await ethers.getContractFactory("Storage");
  const storage = await Storage.deploy("Initial message");

  await storage.deployed();

  console.log("Deployed Storage at", storage.address);
  setDeploymentProperty(network, ConfigProperty.Storage, storage.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
