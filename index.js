
require("dotenv").config();
const express = require("express");
const { handleIncomingMessage } = require("./src/consultativeBot");

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    
    if (!message || !message.text) {
      console.log("📩 Webhook recebido, mas sem mensagem de texto processável.");
      return res.sendStatus(200);
    }

    const userMessage = message.text.body;
    console.log(`💬 Mensagem recebida do usuário: "${userMessage}"`);

    const response = await handleIncomingMessage(userMessage);

    console.log(`🤖 Resposta do bot: "${response}"`);
    res.status(200).json({ response });
  } catch (error) {
    console.error("❌ Erro ao processar mensagem:", error.message);
    res.status(500).json({ error: "Erro ao enviar resposta" });
  }
});

app.get("/webhook", (req, res) => {
  res.status(200).send("✅ Webhook da Valorei ativo.");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor da Valorei rodando na porta ${PORT}`);
});
