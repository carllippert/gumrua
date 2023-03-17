import hre, { ethers } from 'hardhat';
import { ConfigProperty, setDeploymentProperty } from '../.deployment/deploymentManager';
import { EURE_TOKEN_ADDRESS } from '../constants/addresses';

async function main() {
  const network = hre.network.name;
  console.log('Network:', network);

  const [deployer, ...users] = await ethers.getSigners();
  console.log('Using address: ', deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('Balance: ', ethers.utils.formatEther(balance));

  // If it's local, deploy a TestERC20 contract
  let eureTokenAddress = EURE_TOKEN_ADDRESS;
  if (network === 'localhost') {
    const TestERC20 = await ethers.getContractFactory('TestERC20');
    const testErc20 = await TestERC20.deploy(users.map((user) => user.address));
    await testErc20.deployed();

    console.log('Deployed TestERC20 at', testErc20.address);
    eureTokenAddress = testErc20.address;
  }

  const Gumrua = await ethers.getContractFactory('Gumrua');
  const gumrua = await Gumrua.deploy(eureTokenAddress);
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
