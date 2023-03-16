import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';
import { Gumrua } from '../typechain-types';

describe('Gumrua', () => {
  let deployer: SignerWithAddress, alice: SignerWithAddress, bob: SignerWithAddress, gumrua: Gumrua;

  const productId = 1;
  const productName = 'My cool pdf';
  const productSlug = 'my-cool-pdf';
  const productPrice = 100;
  const productImage =
    'https://public-files.gumroad.com/variants/utn8k57wknpyxf1zjp9ij0f8nvpv/e82ce07851bf15f5ab0ebde47958bb042197dbcdcae02aa122ef3f5b41e97c02';

  before(async () => {
    [deployer, alice, bob] = await ethers.getSigners();

    const Gumrua = await ethers.getContractFactory('Gumrua');
    gumrua = await Gumrua.deploy();
    await gumrua.deployed();
  });

  describe('Create product', async () => {
    before(async () => {
      // Alice creates a product
      const tx = await gumrua
        .connect(alice)
        .createProduct(productName, productSlug, productPrice, productImage);
      await tx.wait();
    });

    it('Creates product with the correct data', async () => {
      const product = await gumrua.products(productId);
      expect(product.price).to.equal(productPrice);
      expect(product.seller).to.equal(alice.address);
      expect(product.name).to.equal(productName);
    });
  });

  describe('Buy product', async () => {
    let tx: ContractTransaction;

    before(async () => {
      // Bob buys Alice's product
      tx = await gumrua.connect(bob).buyProduct(productId, {
        value: productPrice,
      });
      await tx.wait();
    });

    it('Mints a product token to Bob', async () => {
      const balance = await gumrua.balanceOf(bob.address, productId);
      expect(balance).to.equal(1);
    });

    it("Sends Bob's money to Alice and fee to owner", async () => {
      const fee = productPrice * 0.05;
      await expect(tx).to.changeEtherBalances(
        [bob, alice, deployer],
        [-productPrice, productPrice - fee, fee],
      );
    });
  });

  describe('Update product price', async () => {
    const newPrice = 200;

    before(async () => {
      // Alice updates her product price
      const tx = await gumrua.connect(alice).updateProductPrice(productId, newPrice);
      await tx.wait();
    });

    it('Updates the product price', async () => {
      const price = (await gumrua.products(productId)).price;
      expect(price).to.equal(newPrice);
    });

    it('Only the owner can update the product price', async () => {
      const tx = gumrua.connect(bob).updateProductPrice(productId, newPrice);
      expect(tx).to.be.revertedWith('Only seller can update price');
    });
  });

  describe('Token transfers', async () => {
    it("Tokens can't be transferred", async () => {
      const tx = gumrua.connect(bob).safeTransferFrom(bob.address, alice.address, productId, 1, []);

      await expect(tx).to.be.revertedWith('Token transfer is not allowed');

      const tx2 = gumrua
        .connect(bob)
        .safeBatchTransferFrom(bob.address, alice.address, [productId], [1], []);

      await expect(tx2).to.be.revertedWith('Token transfer is not allowed');
    });
  });
});
