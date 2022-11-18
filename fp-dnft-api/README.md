# Flying People DNFT API

A simple express server to:

- Serve DNFT Images (/public/dnft-images)
- Expose an endpoint (`update-wearables`), called by the Collection contract using `Chainlink Oracle Client`.

The endpoint will receive a set of parameters from the smart contract to create an updated Flying People DNFT Image.

## Install dependencies

```bash
npm i
```

## Create a .env.local and set as you need.

```
GOERLI_RPC_URL=https://eth-goerli.g.alchemy.com/v2/KEY
```
## Run

```bash
npm run start
```

# All Done!

At this point you have the `contracts` deployed and `minted` the DNFT's
A running `APP` to claim an NFT.
