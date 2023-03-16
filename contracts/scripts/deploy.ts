import hre, { ethers } from 'hardhat';
import { ConfigProperty, setDeploymentProperty } from '../.deployment/deploymentManager';

async function main() {
  const network = hre.network.name;
  console.log('Network:', network);

  const GumruaProduct = await ethers.getContractFactory('GumruaProduct');
  const gumruaProduct = await GumruaProduct.deploy();
  await gumruaProduct.deployed();

  console.log('Deployed Storage at', gumruaProduct.address);
  setDeploymentProperty(network, ConfigProperty.GumruaProduct, gumruaProduct.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
