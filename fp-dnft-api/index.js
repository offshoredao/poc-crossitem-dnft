const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Yooo!");
});

app.get("/update-wearables", (req, res) => {
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
  // Componer las imagenes
  // Escribir imagen en dnft-imges directory
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
