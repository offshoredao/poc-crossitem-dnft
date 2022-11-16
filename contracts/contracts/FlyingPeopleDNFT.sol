// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Drop.sol";

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
contract FlyingPeopleDNFT is ERC721Drop {
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
    event NewSetEquiped(uint256 tokenId);

    //
    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps,
        address _primarySaleRecipient
    ) ERC721Drop(_name, _symbol, _royaltyRecipient, _royaltyBps, _primarySaleRecipient) {}

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
        emit NewSetEquiped(_tokenId);
    }
}
