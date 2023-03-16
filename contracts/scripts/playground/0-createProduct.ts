import hre, { ethers } from 'hardhat';
import { getDeploymentProperty, ConfigProperty } from '../../.deployment/deploymentManager';

async function main() {
  const network = hre.network.name;
  console.log('Network:', network);

  const [, alice] = await ethers.getSigners();

  // Get contract
  const gumrua = await ethers.getContractAt(
    'Gumrua',
    getDeploymentProperty(network, ConfigProperty.Gumrua),
  );

  // Set data
  const price = ethers.utils.parseEther('100');
  const name = 'My cool pdf';
  const slug = 'my-cool-pdf';
  const image =
    'https://public-files.gumroad.com/variants/utn8k57wknpyxf1zjp9ij0f8nvpv/e82ce07851bf15f5ab0ebde47958bb042197dbcdcae02aa122ef3f5b41e97c02';
  const tx = await gumrua.connect(alice).createProduct(name, slug, price, image);
  const receipt = await tx.wait();

  const id = receipt.events?.find((e) => e.event === 'ProductCreated')?.args?._productId;
  console.log('Created new product with id: ', id);

  const product = await gumrua.products(0);
  console.log('Product: ', product);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
