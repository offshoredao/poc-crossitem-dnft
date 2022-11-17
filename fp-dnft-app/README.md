# Offshore Genesis Map 

- Mint Page: https://dapp.theoffshore.io
- Collection: https://opensea.io/collection/offshoredao
- Contract: 
    - https://etherscan.io/address/0x1aa146c9f24f7d2a6349f935ec3da3268c8eb199
    - https://etherscan.io/token/0x1aa146c9f24f7d2a6349f935ec3da3268c8eb199
## Tools

- [**NFT Drop**](https://portal.thirdweb.com/pre-built-contracts/nft-drop): to create a lazy-minted ERC721 NFT Collection that our users can claim.
- [**React SDK**](https://docs.thirdweb.com/react): to enable users to connect their wallets with the [useMetamask](https://portal.thirdweb.com/react/react.usemetamask) hook, and access hooks such as [useNFTDrop](https://portal.thirdweb.com/react/react.usenftdrop) to interact with the NFT drop contract.
- [**TypeScript SDK**](https://docs.thirdweb.com/typescript): to view the claimed supply, total supply, and mint NFTs from the drop.

## Using This Repo

To create your own version of this template, you can use the following steps:

Run this command from the terminal to clone this project:

```bash
npx thirdweb create --template nft-drop
```

### 1. Deploy Your Own NFT Drop 

You can learn how to do that [Release an NFT drop](https://portal.thirdweb.com/guides/release-an-nft-drop-with-no-code#create-a-drop-contract).

Be sure to configure a **name**, **description**, and **image** for your NFT drop in the dashboard.

### 2. Configure the styles

You can fully customize the colors and style of this template by editing the values in the [`globals.css`](/styles/globals.css) file.

You can configure:

- The color of the background with `--background-color`
- The color of the text with `--text-color`
- The color of the button (is a gradient from primary to secondary color) with `--color-primary` and `--color-secondary`
- The font with `--font`
- The border colors with `--border-color`

### 3. Plug in your NFT Drop contract address

Replace the value of the `myNftDropContractAddress` inside [`index.tsx`](/pages/index.tsx) with your NFT Drop contract address you can find in the dashboard.

### 4. Configure Your Network

Inside [`_app.tsx`](/pages/_app.tsx) you can configure the network you want to use:

```jsx
// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mainnet;
```

Create a .env.local and set as you need.

```
ALCHEMY_RPC="https://eth-goerli.g.alchemy.com/v2/MY_KEY"
```


