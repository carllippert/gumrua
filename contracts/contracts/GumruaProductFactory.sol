// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./GumruaProduct.sol";

/**
 * - Make each product an NFT?
 */

contract GumruaProductFactory {
    using Counters for Counters.Counter;

    // Product id to product
    mapping(uint256 => Product) public products;

    // Id counter
    Counters.Counter nextProductId;

    struct Product {
        address owner;
        address tokenAddress;
    }

    /**
     * @dev Creates a new product
     * @param _price Price of the product
     */
    function createProduct(uint256 _price) external {
        GumruaProduct productToken = new GumruaProduct("Gumrua Product", "GMP", _price);

        uint256 id = nextProductId.current();
        Product memory product = Product(msg.sender, address(productToken));
        products[id] = product;
    }
}
