require("dotenv").config();
const express = require("express");
const { handleIncomingMessage } = require("./src/consultativeBot");

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message) {
    return res.sendStatus(200);
  }
  const response = await handleIncomingMessage(message);
  res.status(200).json({ response });
});

app.get("/webhook", (req, res) => {
  res.status(200).send("Webhook da Valorei ativo.");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});