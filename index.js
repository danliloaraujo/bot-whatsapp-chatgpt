require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { gerarResposta } = require('./src/consultativeBot');

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

let historico = {};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
    const resposta = await gerarResposta(historico[from]);
    historico[from].push({ role: 'assistant', content: resposta });

    const delayTime = Math.min(Math.max(resposta.length * 15, 10000), 20000);
    await delay(delayTime);

    await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: from,
        text: { body: resposta }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error("Erro ao enviar resposta:", error.message);
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});