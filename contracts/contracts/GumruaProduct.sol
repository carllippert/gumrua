// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * - set price
 * - soulbound: block transfers
 * - set uri, with name and description of the product
 * - claim function for seller (or maybe this is done by the factory)
 *
 * - take fee on buy
 */

contract GumruaProduct is ERC1155 {
    using Counters for Counters.Counter;

    struct Product {
        address owner;
        uint256 price;
    }

    // Product id to product
    mapping(uint256 => Product) public products;

    // Product id counter
    Counters.Counter nextProductId;

    constructor() ERC1155("") {}

    /**
     * @dev Creates a new product
     * @param _price Price of the product
     */
    function createProduct(uint256 _price) public {
        uint256 id = nextProductId.current();
        Product memory product = Product(msg.sender, _price);
        products[id] = product;
    }

    /**
     * @dev Buys the product by paying the price
     * @param _productId Id of the product
     */
    function buyProduct(uint256 _productId) public payable {
        Product memory product = products[_productId];
        require(msg.value >= product.price, "Not enough ETH sent");

        _mint(msg.sender, _productId, 1, "");

        (bool sent, ) = payable(product.owner).call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }
}
