import hre, { ethers } from 'hardhat';
import { getDeploymentProperty, ConfigProperty } from '../../.deployment/deploymentManager';

async function main() {
  const network = hre.network.name;
  console.log('Network:', network);

  const [, alice] = await ethers.getSigners();

  // Get contract
  const gumruaProduct = await ethers.getContractAt(
    'GumruaProduct',
    getDeploymentProperty(network, ConfigProperty.GumruaProduct),
  );

  // Set data
  const price = 100;
  const name = 'My cool pdf';
  const tx = await gumruaProduct.connect(alice).createProduct(name, price);
  await tx.wait();

  const product = await gumruaProduct.products(0);

  const uri = await gumruaProduct.uri(0);
  console.log('Uri: ', uri);

  console.log('Created new product: ', product);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
