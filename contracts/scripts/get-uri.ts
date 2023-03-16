import hre, { ethers } from 'hardhat';
import { getDeploymentProperty, ConfigProperty } from '../.deployment/deploymentManager';

async function main() {
  const network = hre.network.name;
  console.log('Network:', network);

  // Get contract
  const gumrua = await ethers.getContractAt(
    'Gumrua',
    getDeploymentProperty(network, ConfigProperty.Gumrua),
  );

  // Set data
  const productId = 0;
  const uri = await gumrua.uri(productId);

  console.log('Uri: ', uri);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
