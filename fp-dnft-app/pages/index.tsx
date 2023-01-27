import {
  useClaimedNFTSupply,
  useContractMetadata,
  useUnclaimedNFTSupply,
  useActiveClaimCondition,
  useAddress,
  Web3Button,
  useContract,
  useContractRead,
  useNFTs,
  ThirdwebNftMedia,
  ConnectWallet,
} from "@thirdweb-dev/react";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import type { NextPage } from "next";
import { useState } from "react";
import styles from "../styles/Theme.module.css";
import Image from "next/image";

// Put Your NFT Drop Contract address from the dashboard here
const myNftDropContractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

const Home: NextPage = () => {
  const { contract: nftDrop } = useContract(myNftDropContractAddress);
  const address = useAddress();
  const { data: userBalance } = useContractRead(nftDrop, "balanceOf", address);

  const { data: nfts, isLoading: loading } = useNFTs(nftDrop, {
    start: 0,
    count: 30,
  });

  // The amount the user claims
  const [tokenId, setTokenId] = useState(-1);
  const [c1, setC1] = useState("0x6ea09d2f74b00c58eb8c1fea74634539f4f71679");
  const [c2, setC2] = useState("0x6ea09d2f74b00c58eb8c1fea74634539f4f71679");
  const [c3, setC3] = useState("0x6ea09d2f74b00c58eb8c1fea74634539f4f71679");
  const [w1, setW1] = useState("");
  const [w2, setW2] = useState("");
  const [w3, setW3] = useState("");

  // Load contract metadata
  const { data: contractMetadata } = useContractMetadata(nftDrop);

  // Load claimed supply and unclaimed supply
  const { data: unclaimedSupply } = useUnclaimedNFTSupply(nftDrop);
  const { data: claimedSupply } = useClaimedNFTSupply(nftDrop);

  // Load the active claim condition
  const { data: activeClaimCondition } = useActiveClaimCondition(nftDrop);

  // Check if there's NFTs left on the active claim phase
  const isNotReady =
    activeClaimCondition &&
    parseInt(activeClaimCondition?.availableSupply) === 0;

  // Check if there's any NFTs left
  const isSoldOut = unclaimedSupply?.toNumber() === 0;

  // Check price
  const price = parseUnits(
    activeClaimCondition?.currencyMetadata.displayValue || "0",
    activeClaimCondition?.currencyMetadata.decimals
  );

  // Multiply depending on quantity
  const priceToMint = price.mul(1);

  // Loading state while we fetch the metadata
  if (!nftDrop || !contractMetadata) {
    return <div className={styles.container}>Loading...</div>;
  }

  const handleSelectNFT = (e: any) => {
    console.log(e.target.id);
    setTokenId(e.target.id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mintInfoContainer}>
        <div className={styles.imageSide}>
          {/* Title of your NFT Collection */}
          <ConnectWallet />
          <h1>{"Flying People DNFT"}</h1>
          {/* Description of your NFT Collection */}
          <p className={styles.description}>
            <button className={styles.mintLabel}>Mint</button>
            {" a Flying People DNFT"}
          </p>
          {/* Image Preview of NFTs */}
          <Image
            width={330}
            height={330}
            className={styles.image}
            src={`/FPCollection.png`}
            alt={`${contractMetadata?.name} preview image`}
          />
          {/* Amount claimed so far */}
          <div className={styles.mintCompletionArea}>
            <div className={styles.mintAreaLeft}>
              <p>Total Minted</p>
            </div>
            <div className={styles.mintAreaRight}>
              {claimedSupply && unclaimedSupply ? (
                <p>
                  {/* Claimed supply so far */}
                  <b>{claimedSupply?.toNumber()}</b>
                  {" / "}
                  {
                    // Add unclaimed and claimed supply to get the total supply
                    claimedSupply?.toNumber() + unclaimedSupply?.toNumber()
                  }
                </p>
              ) : (
                // Show loading state if we're still loading the supply
                <p>Loading...</p>
              )}
            </div>
          </div>
          {
            // Sold out or show the claim button
            isSoldOut ? (
              <div>
                <h2>Sold Out</h2>
              </div>
            ) : isNotReady ? (
              <div>
                <h2>Not ready to be minted yet</h2>
              </div>
            ) : (
              <>
                <div className={styles.mintContainer}>
                  <Web3Button
                    contractAddress={myNftDropContractAddress}
                    action={async (contract) => await contract.erc721.claim(1)}
                    // If the function is successful, we can do something here.
                    onSuccess={(result) =>
                      alert(
                        `Successfully claimed ${
                          result.length
                        } Flying People DNFT${result.length > 1 ? "s" : ""}!`
                      )
                    }
                    // If the function fails, we can do something here.
                    // onError={(error) => alert(error?.message)}
                    onError={(error) =>
                      alert(
                        "Private Mint: No claim rights found for this address"
                      )
                    }
                    accentColor="#f213a4"
                    colorMode="dark"
                  >
                    {`Claim ${1 > 1 ? ` ${1}` : ""}${
                      activeClaimCondition?.price.eq(0)
                        ? ""
                        : activeClaimCondition?.currencyMetadata.displayValue
                        ? ` (${formatUnits(
                            priceToMint,
                            activeClaimCondition.currencyMetadata.decimals
                          )} ${activeClaimCondition?.currencyMetadata.symbol})`
                        : ""
                    }`}
                  </Web3Button>
                </div>
              </>
            )
          }
        </div>
        <div className={styles.myNfts}>
          {<h1>My collection</h1>}

          {nfts?.filter((nft) => nft.owner === address).length === 0 ? (
            "You dont have any Flying People NFT"
          ) : (
            <p>
              <button className={styles.mainButton}>Select</button>
              {" a "}
              <b>{"<Flying People>"}</b> to <b>{"<Set Wearables>"}</b>
            </p>
          )}

          {nfts && nfts?.length > 0 && (
            <div className={styles.cards}>
              {nfts
                .filter((nft) => nft.owner === address)
                .map((nft) => (
                  <div
                    key={nft.metadata.id.toString()}
                    className={
                      tokenId.toString() === nft.metadata.id
                        ? styles.selectedCard
                        : styles.card
                    }
                  >
                    <h2>{nft.metadata.name}</h2>
                    <img
                      className={styles.image}
                      src={
                        nft.metadata.image + "?" + new Date().getTime() || ""
                      }
                    ></img>
                    <button
                      id={nft.metadata.id.toString()}
                      onClick={handleSelectNFT}
                      className={styles.mainButton}
                    >
                      Select
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className={styles.setWearable}>
          <h1>Set Wearables</h1>
          {nfts?.filter((nft) => nft.owner === address).length === 0 ? (
            "You dont have any Flying People NFT"
          ) : (
            <>
              <p>
                Set <b>{"<Collection Address>"}</b> and <b>{"<tokenId>"}</b>{" "}
                <br></br>for each Wearable you own.
              </p>
              <p>
                This is a{" "}
                <a
                  href="https://testnets.opensea.io/collection/decentraland-sample-wearables"
                  target="_blank"
                  rel="noreferrer"
                >
                  Wearables Mock Collection
                </a>
                for testnet purposes. You can buy a Mock NFT to be used as
                Wearable.
              </p>  
              <p>
                You can also claim some 
                <a
                  href="https://thirdweb.com/goerli/0x6EA09D2F74b00C58eB8C1fEA74634539f4f71679/nfts"
                  target="_blank"
                  rel="noreferrer"
                >
                  {" here"}
                </a>
              </p>
              <div className={styles.formInline}>
                <h4>Wearable 1</h4>
                <input
                  className={styles.textInputL}
                  id="c1"
                  onChange={(e) => {
                    setC1(e.target.value);
                  }}
                  value={c1}
                  placeholder="Collection Address"
                />
                <input
                  className={styles.textInputR}
                  id="w1"
                  onChange={(e) => {
                    setW1(e.target.value);
                  }}
                  value={w1}
                  placeholder="TokenId"
                />
                <h4>Wearable 2</h4>
                <input
                  className={styles.textInputL}
                  id="c2"
                  onChange={(e) => {
                    setC2(e.target.value);
                  }}
                  value={c2}
                  placeholder="Collection Address"
                />
                <input
                  className={styles.textInputR}
                  id="w2"
                  onChange={(e) => {
                    setW2(e.target.value);
                  }}
                  value={w2}
                  placeholder="TokenId"
                />
                <h4>Wearable 3</h4>
                <input
                  className={styles.textInputL}
                  id="c3"
                  onChange={(e) => {
                    setC3(e.target.value);
                  }}
                  value={c3}
                  placeholder="Collection Address"
                />
                <input
                  className={styles.textInputR}
                  id="w3"
                  onChange={(e) => {
                    setW3(e.target.value);
                  }}
                  value={w3}
                  placeholder="TokenId"
                />
              </div>
              <Web3Button
                contractAddress={myNftDropContractAddress}
                className={styles.setWearableButton}
                onSuccess={() =>
                  alert(
                    `Successfully Updated, wait a minute to see you new DNFT image.`
                  )
                }
                action={async (contract) => {
                  if (
                    tokenId === -1 ||
                    c1.length === 0 ||
                    c2.length === 0 ||
                    c3.length === 0 ||
                    w1.length === 0 ||
                    w2.length === 0 ||
                    w3.length === 0
                  )
                    alert(
                      "Please, select a Flying People and fill the Set Wearables form."
                    );
                  else
                    return await contract.call(
                      "setWearables",
                      [c1, c2, c3],
                      [w1, w2, w3],
                      tokenId
                    );
                  throw new Error();
                }}
              >
                Set Wearables
              </Web3Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
