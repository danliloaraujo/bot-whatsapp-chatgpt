
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { getRespostaPersonalizada } = require('./src/respostas');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';

let historico = {};

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

app.post('/webhook', async (req, res) => {
  const entry = req.body.entry?.[0];
  const message = entry?.changes?.[0]?.value?.messages?.[0];
  const from = message?.from;
  const text = message?.text?.body;

  if (!from || !text) return res.sendStatus(200);
  if (!historico[from]) historico[from] = [];

  historico[from].push({ role: 'user', content: text });

  try {
    const respostaIA = await getRespostaPersonalizada(text);

    historico[from].push({ role: 'assistant', content: respostaIA });

    const delayTime = Math.min(Math.max(respostaIA.length * 15, 10000), 20000);
    await delay(delayTime);

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
    console.error("Erro no webhook:", err.message);
  }

  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send("🤖 Valorei Bot está rodando com comportamento consultivo!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
