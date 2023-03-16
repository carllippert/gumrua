import hre, { ethers } from 'hardhat';
import { getDeploymentProperty, ConfigProperty } from '../../.deployment/deploymentManager';

async function main() {
  const network = hre.network.name;
  console.log('Network:', network);

  const [, , bob] = await ethers.getSigners();

  // Get contract
  const gumruaProduct = await ethers.getContractAt(
    'GumruaProduct',
    getDeploymentProperty(network, ConfigProperty.GumruaProduct),
  );

  // Set data
  const productId = 0;
  const tx = await gumruaProduct.connect(bob).buy(productId, {
    value: 100,
  });
  await tx.wait();

  console.log('Bought product with id: ', productId);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
