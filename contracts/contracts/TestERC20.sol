// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestERC20 is ERC20 {
    uint256 constant maxMint = 1000 * (10 ** 18);

    constructor(address[] memory _addresses) ERC20("Test", "TST") {
        for (uint256 i = 0; i < _addresses.length; i++) {
            // Mint 1000 tokens to every user
            _mint(_addresses[i], maxMint);
        }
    }
}
