const fs = require("fs");
require("dotenv").config()
const sharp = require("sharp");
const express = require("express");
const axios = require("axios");
const thirdwebSDK = require("@thirdweb-dev/sdk/evm");
const Path = require("path");

const app = express();
const PORT = 3000;

const sdk = new thirdwebSDK.ThirdwebSDK(process.env.GOERLI_RPC_URL);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Yooo!");
});

app.get("/update-wearables", async (req, res) => {
  const c1 = req.query.c1;
  const w1 = req.query.w1;
  const c2 = req.query.c2;
  const w2 = req.query.w2;
  const c3 = req.query.c3;
  const w3 = req.query.w3;
  const tokenId = req.query.tokenId;

  console.log("Test Contract Call - ", tokenId);
  console.log("Test Contract Call N - ", Number(tokenId));
  console.log("c1=", c1);
  console.log("c2=", c2);
  console.log("c3=", c3);
  console.log("w2=", w1);
  console.log("w2=", w2);
  console.log("w3=", w3);
  // Buscar cada imagen de wearable
  const [contract1, contract2, contract3] = await Promise.all([
    sdk.getContract(c1),
    sdk.getContract(c2),
    sdk.getContract(c3),
  ]);
  let [tokenURI1, tokenURI2, tokenURI3] = await Promise.all([
    contract1.call("tokenURI", w1),
    contract2.call("tokenURI", w2),
    contract3.call("tokenURI", w3),
  ]);

  if (tokenURI1.startsWith("ipfs://"))
    tokenURI1 = tokenURI1.replace("ipfs://", "https://ipfs.io/ipfs/");
  if (tokenURI2.startsWith("ipfs://"))
    tokenURI2 = tokenURI2.replace("ipfs://", "https://ipfs.io/ipfs/");
  if (tokenURI3.startsWith("ipfs://"))
    tokenURI3 = tokenURI3.replace("ipfs://", "https://ipfs.io/ipfs/");

  const [metadata1, metadata2, metadata3] = await Promise.all([
    axios.get(tokenURI1),
    axios.get(tokenURI2),
    axios.get(tokenURI3),
  ]);

  let imageLink1 = metadata1.data.image;
  let imageLink2 = metadata2.data.image;
  let imageLink3 = metadata3.data.image;

  if (imageLink1.startsWith("ipfs://"))
    imageLink1 = imageLink1.replace("ipfs://", "https://ipfs.io/ipfs/");
  if (imageLink2.startsWith("ipfs://"))
    imageLink2 = imageLink2.replace("ipfs://", "https://ipfs.io/ipfs/");
  if (imageLink3.startsWith("ipfs://"))
    imageLink3 = imageLink3.replace("ipfs://", "https://ipfs.io/ipfs/");

  console.log("imageLink1=", imageLink1);
  console.log("imageLink2=", imageLink2);
  console.log("imageLink3=", imageLink3);

  const [response1, response2, response3] = await Promise.all([
    axios({
      url: imageLink1,
      method: "GET",
      responseType: "arraybuffer",
    }),
    axios({
      url: imageLink2,
      method: "GET",
      responseType: "arraybuffer",
    }),
    axios({
      url: imageLink3,
      method: "GET",
      responseType: "arraybuffer",
    }),
  ]);

  await sharp("./public/background.png")
    .composite([
      {
        input: "./public/fp-images/" + tokenId + ".png",
        blend: "add",
        left: 0,
        top: 0,
      },
      { input: response1.data, blend: "add", left: 2048, top: 0 },
      { input: response2.data, blend: "add", left: 0, top: 2048 },
      { input: response3.data, blend: "add", left: 2048, top: 2048 },
    ])
    // Escribir imagen en dnft-imges directory
    .toFile("public/dnft-images/" + tokenId + ".png");

  res.status = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    tokenId: tokenId,
  });
});

app.get("/verify-polygon-nfts", (req, res) => {
  const c1 = req.query.c1;
  const t1 = req.query.t1;
  const c2 = req.query.c2;
  const t2 = req.query.t2;
  const c3 = req.query.c3;
  const t3 = req.query.t3;
  const sender = req.query.sender;

  // Buscar cada nft en polygon
  // Validar ownerOf cada token === sender
  // retorno OK o ERROR
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
