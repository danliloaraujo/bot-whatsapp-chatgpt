
const express = require("express");
const bodyParser = require("body-parser");
const { handleIncomingMessage } = require("./src/consultativeBot");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.get("/webhook", (req, res) => {
  res.send("Webhook is running");
});

app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      console.log("Mensagem não encontrada no payload recebido.");
      return res.sendStatus(200);
    }

    const response = await handleIncomingMessage(message);
    res.status(200).json({ response });
  } catch (error) {
    console.error("Erro ao enviar resposta:", error.message);
    res.status(500).json({ error: "Erro ao enviar resposta" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
