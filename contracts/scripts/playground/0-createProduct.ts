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
  const priceEuro = ethers.utils.parseEther('94');
  const name = 'Test';
  const slug = 'test';
  const description =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, velit rerum reprehenderit natus omnis eligendi iure amet fugit assumenda cumque id ad qui quos alias odit iusto provident. Nostrum accusamus quae iure quod maiores!';
  const image =
    'https://qqhuhpdwqoguhxekruva.supabase.co/storage/v1/object/public/public/16790793531262.webp';
  const tx = await gumrua
    .connect(alice)
    .createProduct(name, slug, description, price, priceEuro, image);
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
