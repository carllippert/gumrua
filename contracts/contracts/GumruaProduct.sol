// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * - set price
 * - buy product: mint by paying price
 * - soulbound: block transfers
 * - set uri
 * - claim function for seller (or maybe this is done by the factory)
 */

contract GumruaProduct is ERC721 {
    using Counters for Counters.Counter;

    // Price of the product
    uint256 public price;

    // Id counter
    Counters.Counter nextId;

    constructor(string memory _name, string memory _symbol, uint256 _price) ERC721(_name, _symbol) {
        price = _price;
    }

    /**
     * @dev Buys the product by paying the price
     */
    function mint() public payable returns (uint256) {
        require(msg.value >= price, "Not enough ETH sent");
        uint256 id = nextId.current();
        _safeMint(msg.sender, id);
        return id;
    }
}
