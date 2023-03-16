import hre, { ethers } from "hardhat";
import {
  getDeploymentProperty,
  ConfigProperty,
} from "../../.deployment/deploymentManager";

async function main() {
  const network = hre.network.name;
  console.log("Network:", network);

  const [, alice] = await ethers.getSigners();

  // Get contract
  const storage = await ethers.getContractAt(
    "Storage",
    getDeploymentProperty(network, ConfigProperty.Storage)
  );

  // Set data
  const tx = await storage.connect(alice).setData("New data");
  await tx.wait();

  console.log("Set new data");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
