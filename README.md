# POC Creating dynamic NFTs to achieve cross-collection interoperable items.

We are at the forefront of the new internet full of possibilities. Where your creativity is valued and your digital objects belong to you.


In this repository we will push the concept of the Metaverse by proving interoperability among already existing NFT collections. Thus new capabilities and expressiveness will be possible for the ecosystem.


Due to their open source nature, we will start with **Decentraland Wearables** which live in the Polygon and Ethereum network.

## Version 0.1 - dNFT and Basic Image Manipulation.

- `nft_collection`: refers to the collection smart contract
- `fp_nft`: each NFT within the *nft_collection*
- `dclwearable_nft`: wearable NFTs from Decentraland
- `dnft_image`: Flying People dynamic ERC-721 image
- `fp_image`: layer_1 of the *dnft_image*

In this initial version we will generate a `nft_collection` of dynamic ERC-721 NFTs, from here on `dNFT`, named Flying People, from here on `fp_nft`, with the ability to link three other referenced NFTs using their contractAddress and tokenId, in this case **Decentraland wearables** NFT, from here on `dclwearable_nft`.

The references to these `dclwearable_nft`(s) will be stored in each `fp_nft` at the smart contract level to validate that the owner of a `fp_nft` is also the owner of the `dclwearable_nft` before linking them.
Now we create a representation of an Avatar (Flying People) with the ability to equip a set of external NFTs as wearables.

In addition to the above, once the ownership of the items is proven in a contract function we will use `Chainlink` to call an API that we will generate a basic visual representation for the dynamic ERC-721 NFTs images from here on `dnft_image`, which in this case is composed of four different images - from here on called `layers`.

- In `layer_1`, the `fp_image` of a Flying People NFT is represented as a base shape.
- In `layer_2`, `layer_3`, and `layer_4`, the images of each `dclwearable_nft` (referenced in the `fp_nft`) will be used.

Allowing the NFT holder to set three assets, which will be three separated layers stored at the `fp_nft` `animation_url`

![dnft-basic-image](./docs-images/DNFT.png)

## How it works

In this Proof of Concept we will use Chainlink, to call an API from our Contract, this API will get the `dclwearable_nft` metadata stored on **IPFS** (Interplanetary File System) and also will get the `dclwearable_nft` images required to compose the new `dnft_image`

Next a representation of `fp_nft` will be created with its user selected `dclwearable_nft`(s) through the `Flying People API` that generates and update the new `dnft_image`.

At the moment, the only missing segment to achieve a visual representation in this use case would be the `Flying People API` capable of combining the images from all sources and assembling a final image that represents a Flying People Avatar.  

The following sequence diagram shows a flow for the proof of concept, which allows us to obtain the entire information stack of a `fp_nft` and its linked `dclwearable_nft` to generate the final image of an avatar by equipping a set of `dclwearable_nft(s)` to it.

![dnft-sequence-diagram](./docs-images/sequence.png)

## Project directories

This repository contains three projects.

### [contracts](./contracts)

Solidity contracts for ERC721 Collection, includes `Chainlink` to call external API.

### [fp-dnft-app](./fp-dnft-app)

DApp to `claim` a ERC721 Flying People DNFT, explore your collection, and `set Wearables`.

### [fp-dnft-api](./fp-dnft-api)

Flying People API to serve DNFT images and `update-wearables` endpoint to update the DNFT images.


