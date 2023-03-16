import hre, { ethers } from 'hardhat';
import { ConfigProperty, setDeploymentProperty } from '../.deployment/deploymentManager';

async function main() {
  const network = hre.network.name;
  console.log('Network:', network);

  const Gumrua = await ethers.getContractFactory('Gumrua');
  const gumrua = await Gumrua.deploy();
  await gumrua.deployed();

  console.log('Deployed Gumrua at', gumrua.address);
  setDeploymentProperty(network, ConfigProperty.Gumrua, gumrua.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
