import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';
import { GumruaProduct } from '../typechain-types';

describe('Gumrua Product', () => {
  let deployer: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress,
    gumruaProduct: GumruaProduct;

  const productPrice = 100;
  const productId = 0;

  before(async () => {
    [deployer, alice, bob] = await ethers.getSigners();

    const GumruaProduct = await ethers.getContractFactory('GumruaProduct');
    gumruaProduct = await GumruaProduct.deploy();
    await gumruaProduct.deployed();
  });

  describe('Create product', async () => {
    before(async () => {
      // Alice creates a product
      const tx = await gumruaProduct.connect(alice).createProduct(productPrice);
      await tx.wait();
    });

    it('Creates product with the correct data', async () => {
      const product = await gumruaProduct.products(0);
      expect(product.price).to.equal(productPrice);
      expect(product.owner).to.equal(alice.address);
    });
  });

  describe('Buy product', async () => {
    let tx: ContractTransaction;

    before(async () => {
      // Bob buys Alice's product
      tx = await gumruaProduct.connect(bob).buyProduct(productId, {
        value: productPrice,
      });
      await tx.wait();
    });

    it('Mints a product token to Bob', async () => {
      const balance = await gumruaProduct.balanceOf(bob.address, productId);
      expect(balance).to.equal(1);
    });

    it("Sends Bob's money to Alice and fee to owner", async () => {
      const fee = productPrice * 0.05;
      expect(tx).to.changeEtherBalances(
        [bob, alice, deployer],
        [-productPrice, productPrice - fee, fee],
      );
    });
  });

  describe('Token transfers', async () => {
    it("Tokens can't be transferred", async () => {
      const tx = gumruaProduct
        .connect(bob)
        .safeTransferFrom(bob.address, alice.address, productId, 1, []);

      await expect(tx).to.be.revertedWith('Token transfer is not allowed');

      const tx2 = gumruaProduct
        .connect(bob)
        .safeBatchTransferFrom(bob.address, alice.address, [productId], [1], []);

      await expect(tx2).to.be.revertedWith('Token transfer is not allowed');
    });
  });
});
