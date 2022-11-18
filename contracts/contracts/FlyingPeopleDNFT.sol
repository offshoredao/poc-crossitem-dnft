// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.12;

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
    event NewSetEquiped(bytes32 _requestId, string _tokenId);

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
    ) public {
        require(ownerOf(_tokenId) == msg.sender, "caller not owner");
        require(
            _collections[0] != address(this) &&
                _collections[1] != address(this) &&
                _collections[2] != address(this),
            "invalid nft"
        );
        // validate each external nft ownership
        for (uint256 i = 0; i < _collections.length; i++) {
            // instance collection
            IERC721 collectionContract = IERC721(_collections[i]);
            // check token ownership
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
        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );
        // Test API URL https://api.flyingpeople.org/update-wearables?tokenId=0&c1=1&t1=t1&c2=c2&t2=t2
        // Temp manual cast for testing, improve this =S

        req.add(
            "get",
            string.concat(
                "https://api.flyingpeople.org/update-wearables?tokenId=",
                Strings.toString(_tokenId),
                "&c1=",
                Strings.toHexString(uint256(uint160(_collections[0])), 20),
                "&c2=",
                Strings.toHexString(uint256(uint160(_collections[1])), 20),
                "&c3=",
                Strings.toHexString(uint256(uint160(_collections[2])), 20),
                "&w1=",
                Strings.toString(_wearableTokenIds[0]),
                "&w2=",
                Strings.toString(_wearableTokenIds[1]),
                "&w3=",
                Strings.toString(_wearableTokenIds[2])
            )
        );
        req.add("path", "tokenId");
        sendChainlinkRequestTo(oracle, req, fee);
    }

    /**
     * Receive the response in the form of string
     */
    function fulfill(bytes32 _requestId, string memory _tokenId)
        public
        recordChainlinkFulfillment(_requestId)
    {
        emit NewSetEquiped(_requestId, _tokenId);
    }
}
