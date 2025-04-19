
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { gerarResposta } = require('./src/consultativeBot');
const respostas = require('./src/respostas');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';

let historico = {};
let lastMessageTime = {};
let mensagensProcessadas = new Set(); // Controle de duplicidade

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

app.post('/webhook', async (req, res) => {
  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  const from = message?.from;
  const text = message?.text?.body;
  const messageId = message?.id;

  if (!from || !text || !messageId) return res.sendStatus(200);

  if (mensagensProcessadas.has(messageId)) {
    console.log("🔁 Mensagem duplicada ignorada:", messageId);
    return res.sendStatus(200);
  }

  mensagensProcessadas.add(messageId);
  setTimeout(() => mensagensProcessadas.delete(messageId), 3600000); // 1h

  if (!historico[from]) historico[from] = [];
  historico[from].push({ role: 'user', content: text });

  try {
    const currentTime = Date.now();
    const timeSinceLast = currentTime - (lastMessageTime[from] || 0);
    const resetDelay = 30000;
    if (timeSinceLast > resetDelay) {
      lastMessageTime[from] = currentTime;
    }

    const respostaIA = await gerarResposta(historico[from]);
    historico[from].push({ role: 'assistant', content: respostaIA });

    const delayTime = Math.min(Math.max(respostaIA.length * 15, 10000), 20000);
    await delay(Math.max(delayTime, resetDelay));

    await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: from,
        text: { body: respostaIA }
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (err) {
    console.error("❌ Erro ao enviar resposta:", err.message);
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
