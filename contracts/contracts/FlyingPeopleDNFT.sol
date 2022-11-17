// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.8;

import "@thirdweb-dev/contracts/base/ERC721Drop.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);
}

/**
 * Collection: Flying People - Dynamic NFT
 *
 * A Flying pleople is a regular ERC721 NFT (fp_nft) with some extra features.
 *
 * 1.- fp_nft **owners** can attach to it three other NFT's, called a **Set** of **Wearables**.
 *
 * 2.- fp_nft **image** is a representation of the fp_nft image itself and three other NFT's.
 *
 * More Info: https://github.com/offshoredao/poc-crossitem-dnft/blob/main/README.md
 */
contract FlyingPeopleDNFT is ERC721Drop, ChainlinkClient {
    // Chainlink
    using Chainlink for Chainlink.Request;
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    // a simple pointer to an NFT that lives on another collection .
    struct Wearable {
        // collection contract address
        address collection;
        // collection nft token id
        uint256 tokenId;
    }

    // 3 wearables, e.g hat, body, pants.
    struct Set {
        Wearable wearable1;
        Wearable wearable2;
        Wearable wearable3;
    }

    // map each NFT tokenId to a Set of Wearable(s) defined by the NFT(s) owner
    mapping(uint256 => Set) public tokenIdToSet;

    // event to emit new set
    event NewSetEquiped(bytes32 _requestId, uint256 _tokenId);

    //
    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps,
        address _primarySaleRecipient
    ) ERC721Drop(_name, _symbol, _royaltyRecipient, _royaltyBps, _primarySaleRecipient) {
        // Goerli LINK address
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        // Ethereum Goerli Oracle Address 0xCC79157eb46F5624204f47AB42b3906cAA40eaB7
        oracle = 0xCC79157eb46F5624204f47AB42b3906cAA40eaB7;
        // Job Id to get > string 7d80a6386ef543a3abb52817f6707e3b
        jobId = "7d80a6386ef543a3abb52817f6707e3b";
        // 0,1 * 10**18 (Varies by network and job)
        fee = (1 * LINK_DIVISIBILITY) / 10;
    }

    /**
     * Attach a Set of Wearables to a fp_nft token (_tokenId).
     * @dev _collections & _wearableTokenIds each array position compose a collection address and token id
     */
    function setWearables(
        address[3] memory _collections,
        uint256[3] memory _wearableTokenIds,
        uint256 _tokenId
    ) public returns (bytes32 requestId) {
        require(ownerOf(_tokenId) == msg.sender, "caller not owner");

        // validate each external nft ownership
        for (uint256 i = 0; i < _collections.length; i++) {
            // instance collection
            IERC721 collectionContract = IERC721(_collections[i]);
            // check token ownershiphttp://159.223.205.1:3000/update-wearables?c1=1&t1=t1&c2=c2&t2=t2
            address tokenOwner = collectionContract.ownerOf(_wearableTokenIds[i]);
            // all good
            if (msg.sender != tokenOwner) {
                revert("caller not owner");
            }
        }
        tokenIdToSet[_tokenId] = Set(
            Wearable(_collections[0], _wearableTokenIds[0]),
            Wearable(_collections[1], _wearableTokenIds[1]),
            Wearable(_collections[2], _wearableTokenIds[2])
        );
        return requestChainlink(_collections, _wearableTokenIds, _tokenId);
    }

    /**
     * Receive the response in the form of string
     */
    function requestChainlink(
        address[3] memory _collections,
        uint256[3] memory _wearableTokenIds,
        uint256 _tokenId
    ) private returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );
        // Test API URL http://159.223.205.1:3000/update-wearables?c1=1&t1=t1&c2=c2&t2=t2

        string memory url = string(
            abi.encodePacked(
                "http://159.223.205.1:3000/update-wearables?tokenId=",
                Strings.toString(_tokenId),
                "&c1=",
                _collections[0],
                "&t1=",
                _wearableTokenIds[0],
                "&c2=",
                _collections[1],
                "&t2=",
                _wearableTokenIds[1],
                "&c3=",
                _collections[2],
                "&t3=",
                _wearableTokenIds[2]
            )
        );
        req.add("get", url);
        req.add("path", "tokenId");
        return sendChainlinkRequestTo(oracle, req, fee);
    }

    /**
     * Receive the response in the form of string
     */
    function fulfill(bytes32 _requestId, uint256 _tokenId)
        public
        recordChainlinkFulfillment(_requestId)
    {
        emit NewSetEquiped(_requestId, _tokenId);
    }
}
