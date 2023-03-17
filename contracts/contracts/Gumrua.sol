// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * - support multiple tokens for payments
 * - claim function instead of sending tokens directly to owner
 * - better metadata image (with gumrua logo)
 * - off-chain data with more info about the product?
 */

contract Gumrua is ERC1155, Ownable {
    using Counters for Counters.Counter;

    /**
     * @dev Product struct
     * @param seller Address of the seller
     * @param name Name of the product
     * @param slug Slug of the product
     * @param description Description of the product
     * @param price Price of the product
     * @param priceEuro Price of the product in EURe tokens
     * @param image Image of the product
     */
    struct Product {
        address seller;
        string name;
        string slug;
        string description;
        uint256 price;
        uint256 priceEuro;
        string image;
    }

    // Product id to product
    mapping(uint256 => Product) public products;

    // Mapping from slug to product id
    mapping(string => uint256) public slugToId;

    // Product id counter
    Counters.Counter nextProductId;

    // Protocol fee per sale (percentage per 10,000, upgradable)
    uint16 public protocolFee;

    // Divider used for fees
    uint16 private constant FEE_DIVIDER = 10000;

    IERC20 public euroToken;

    // =========================== Events ==============================

    /**
     * @dev Emitted when a new product is created
     */
    event ProductCreated(
        uint256 indexed _productId,
        address indexed _seller,
        string _name,
        string _slug,
        string _description,
        uint256 _price,
        uint256 _priceEuro,
        string _image
    );

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

    constructor(IERC20 _euroToken) ERC1155("") {
        setProtocolFee(500);
        nextProductId.increment();
        euroToken = _euroToken;
    }

    // =========================== User functions ==============================

    /**
     * @dev Creates a new product
     * @param _name Name of the product
     * @param _slug Slug of the product
     * @param _description Description of the product
     * @param _price Price of the product in EURe tokens
     * @param _priceEuro Price of the product in euro
     * @param _image Image of the product
     */
    function createProduct(
        string memory _name,
        string memory _slug,
        string memory _description,
        uint256 _price,
        uint256 _priceEuro,
        string memory _image
    ) public {
        uint256 id = nextProductId.current();
        Product memory product = Product(msg.sender, _name, _slug, _description, _price, _priceEuro, _image);
        products[id] = product;
        slugToId[_slug] = id;
        nextProductId.increment();

        emit ProductCreated(id, msg.sender, _name, _slug, _description, _price, _priceEuro, _image);
    }

    /**
     * @dev Updates the price of the product
     * @param _productId Id of the product
     * @param _price New price of the product
     * @param _priceEuro New price of the product in euro
     */
    function updateProductPrice(uint256 _productId, uint256 _price, uint256 _priceEuro) public {
        Product storage product = products[_productId];
        require(product.seller == msg.sender, "Only seller can update price");
        product.price = _price;
        product.priceEuro = _priceEuro;

        emit ProductPriceUpdated(_productId, _price);
    }

    /**
     * @dev Buys the product by paying the price
     * @param _productId Id of the product
     */
    function buyProduct(uint256 _productId) public payable {
        Product memory product = products[_productId];
        bool isEure = msg.value == 0; // whether the buyer is buying with EURe tokens
        uint256 price = isEure ? product.priceEuro : product.price;

        // If msg.value == 0, it means that the user is paying with EURe tokens
        require(isEure || msg.value == price, "Not enough ETH sent");

        if (isEure) {
            require(euroToken.transferFrom(msg.sender, address(this), price), "Transfer must not fail");
        }

        _mint(msg.sender, _productId, 1, "");

        uint256 fee = (protocolFee * price) / FEE_DIVIDER;

        sendBalance(payable(product.seller), price - fee, isEure);
        sendBalance(payable(owner()), fee, isEure);

        emit ProductBought(_productId, msg.sender, msg.value, fee);
    }

    function sendBalance(address payable _recipient, uint256 _amount, bool _isEure) internal {
        if (_isEure) {
            require(euroToken.transfer(_recipient, _amount), "Transfer must not fail");
        } else {
            (bool sent, ) = payable(_recipient).call{value: _amount}("");
            require(sent, "Failed to send Ether");
        }
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
        Product memory product = products[_id];

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                product.name,
                                '", "image":"',
                                product.image,
                                unicode'", "description": "Gumrua Product"}'
                            )
                        )
                    )
                )
            );
    }
}
