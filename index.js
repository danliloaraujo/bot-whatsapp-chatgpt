
require("dotenv").config();
const express = require("express");
const { handleIncomingMessage } = require("./src/consultativeBot");

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.message;
    const response = await handleIncomingMessage(message);
    res.status(200).json({ response });
  } catch (error) {
    console.error("Erro ao enviar resposta:", error.message);
    res.status(500).json({ error: "Erro ao enviar resposta" });
  }
});

app.get("/webhook", (req, res) => {
  res.status(200).send("Webhook da Valorei ativo.");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
