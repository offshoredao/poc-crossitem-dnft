# Flying People DNFT DApp

Build using Next and Thirdweb sdk.

- Claim DApp: https://flyingpeople.org/

# Pre requisites

Follow the contracts proyect readme to deploy the contracts first.

- [**Flying People DNFT contracts**](../contracts/)

Once deployed get you Collection contract `address` and follow the instructions

## Install dependencies

```bash
npm i
# or
yarn
```

## Configure Your Network

Inside [`_app.tsx`](/pages/_app.tsx) you can configure the network you want to use:

```jsx
// This is the chainId your dApp will work on.
const activeChainId = ChainId.Goerli;
```

## Create a .env.local and set as you need.

Set `CONTRACT_ADDRESS` from you contract deployment.

```
NEXT_PUBLIC_ALCHEMY_RPC=https://eth-goerli.g.alchemy.com/v2/KEY
NEXT_PUBLIC_CONTRACT_ADDRESS="0x111"
```

## Run

```bash
npm run dev
# or
yarn start
```

# All Done!

At this point you have:

- 1. The [`contracts`](../contracts/README.md) deployed and batch `minted` the DNFT's.

- 2. A running `App` to `claim` and check your owned Flying People DNFT's

As a final step we need to launch a server to expose the collection NFT images and an endpoint that will be called from our smart contracts using Chainlink.

Check the [fp-dnft-api](../fp-dnft-api) directory to launch this server.


