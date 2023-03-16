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
  const price = ethers.utils.parseEther('100');
  const name = 'My cool pdf';
  const tx = await gumruaProduct.connect(alice).createProduct(name, price);
  const receipt = await tx.wait();

  const id = receipt.events?.find((e) => e.event === 'ProductCreated')?.args?._productId;
  console.log('Created new product with id: ', id);

  const product = await gumruaProduct.products(0);
  console.log('Product: ', product);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
