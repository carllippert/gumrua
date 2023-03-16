// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * - support multiple tokens for payments
 * - claim function instead of sending tokens directly to owner
 * - better metadata image (with gumrua logo)
 * - off-chain data with more info about the product?
 * - allow to update product price
 */

contract GumruaProduct is ERC1155, Ownable {
    using Counters for Counters.Counter;

    struct Product {
        address seller;
        string name;
        uint256 price;
    }

    // Product id to product
    mapping(uint256 => Product) public products;

    // Product id counter
    Counters.Counter nextProductId;

    // Protocol fee per sale (percentage per 10,000, upgradable)
    uint16 public protocolFee;

    // Divider used for fees
    uint16 private constant FEE_DIVIDER = 10000;

    // =========================== Events ==============================

    /**
     * @dev Emitted when a new product is created
     */
    event ProductCreated(uint256 indexed _productId, address indexed _seller, string _name, uint256 _price);

    /**
     * @dev Emitted when a product is bought
     */
    event ProductBought(uint256 indexed _productId, address indexed _buyer, uint256 _price, uint256 _fee);

    /**
     * @dev Emitted when the price of a product is updated
     */
    event ProductPriceUpdated(uint256 indexed _productId, uint256 _price);

    /**
     * @dev Emitted when the protocol fee is updated
     */
    event ProtocolFeeUpdated(uint256 _fee);

    // =========================== Constructor ==============================

    constructor() ERC1155("") {
        setProtocolFee(500);
    }

    // =========================== User functions ==============================

    /**
     * @dev Creates a new product
     * @param _name Name of the product
     * @param _price Price of the product
     */
    function createProduct(string memory _name, uint256 _price) public {
        uint256 id = nextProductId.current();
        Product memory product = Product(msg.sender, _name, _price);
        products[id] = product;
        nextProductId.increment();

        emit ProductCreated(id, msg.sender, _name, _price);
    }

    /**
     * @dev Updates the price of the product
     * @param _productId Id of the product
     * @param _price New price of the product
     */
    function updateProductPrice(uint256 _productId, uint256 _price) public {
        Product storage product = products[_productId];
        require(product.seller == msg.sender, "Only seller can update price");
        product.price = _price;

        emit ProductPriceUpdated(_productId, _price);
    }

    /**
     * @dev Buys the product by paying the price
     * @param _productId Id of the product
     */
    function buyProduct(uint256 _productId) public payable {
        Product memory product = products[_productId];
        require(msg.value >= product.price, "Not enough ETH sent");

        _mint(msg.sender, _productId, 1, "");

        uint256 fee = (protocolFee * msg.value) / FEE_DIVIDER;

        (bool sentSeller, ) = payable(product.seller).call{value: msg.value - fee}("");
        require(sentSeller, "Failed to send Ether to seller");

        (bool sentOwner, ) = payable(owner()).call{value: fee}("");
        require(sentOwner, "Failed to send Ether to owner");

        emit ProductBought(_productId, msg.sender, msg.value, fee);
    }

    // =========================== Owner functions ==============================

    /**
     * @dev Sets the protocol fee per sale
     * @param _protocolFee Protocol fee per sale (percentage per 10,000)
     */
    function setProtocolFee(uint16 _protocolFee) public onlyOwner {
        protocolFee = _protocolFee;

        emit ProtocolFeeUpdated(_protocolFee);
    }

    // =========================== Overrides ==============================

    /**
     * @dev Blocks token transfers
     */
    function safeTransferFrom(address, address, uint256, uint256, bytes memory) public virtual override {
        revert("Token transfer is not allowed");
    }

    /**
     * @dev Blocks token transfers
     */
    function safeBatchTransferFrom(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual override {
        revert("Token transfer is not allowed");
    }

    /**
     * @dev See {IERC1155MetadataURI-uri}.
     * @param _id The ID of the product
     */
    function uri(uint256 _id) public view virtual override returns (string memory) {
        string memory name = products[_id].name;

        bytes memory image = abi.encodePacked(
            "data:image/svg+xml;base64,",
            Base64.encode(
                bytes(
                    abi.encodePacked(
                        '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="720"><rect width="100%" height="100%"/>',
                        '<text x="30" y="100" style="font: 42px sans-serif;fill:#fff">Gumrua</text>',
                        '<text x="30" y="670" style="font: 28px sans-serif;fill:#fff">',
                        name,
                        "</text></svg>"
                    )
                )
            )
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name,
                                '", "image":"',
                                image,
                                unicode'", "description": "Gumrua Product"}'
                            )
                        )
                    )
                )
            );
    }
}
