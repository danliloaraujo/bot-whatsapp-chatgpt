require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;
const bot = require('./src/consultativeBot');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor rodando...');
});

app.post('/webhook', async (req, res) => {
  const entry = req.body?.entry?.[0];
  const changes = entry?.changes?.[0];
  const message = changes?.value?.messages?.[0];

  if (message) {
    const from = message.from;
    const text = message.text?.body;

    if (text) {
      const respostaIA = await bot.gerarResposta(text);
      await axios.post(`https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`, {
        messaging_product: 'whatsapp',
        to: from,
        text: { body: respostaIA }
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});