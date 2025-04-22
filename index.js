
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
let mensagensProcessadas = new Set(); // Controle de duplicidade
let respostaTimers = {}; // Controle de debounce

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}


app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('🟢 Verificação de webhook recebida');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {
  console.log('🧪 DEBUG-v49.9.26 | Payload recebido:', JSON.stringify(req.body));
  console.log('📥 Payload recebido:', JSON.stringify(req.body));
  console.log('Payload recebido.');

  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  console.log('🧪 DEBUG-v49.9.26 | Mensagem identificada:', message);
  const from = message?.from;
  const text = message?.text?.body;
  const messageId = message?.id;

  console.log('Mensagem:', text);

  if (!from || !text || !messageId) return res.sendStatus(200);

  if (mensagensProcessadas.has(messageId)) {
    console.log('🔁 Mensagem duplicada ignorada:', messageId);
    return res.sendStatus(200);
  }

  mensagensProcessadas.add(messageId);
  setTimeout(() => mensagensProcessadas.delete(messageId), 3600000); // 1h

  if (!historico[from]) historico[from] = [];
  historico[from].push({ role: 'user', content: text });

  if (respostaTimers[from]) {
    clearTimeout(respostaTimers[from]);
  }

      respostaTimers[from] = setTimeout(() => {
        (async () => {
    try {
      const respostaIA = await gerarResposta(historico[from]);
    console.log(`🧪 DEBUG-v49.9.26 | Resposta gerada: ${respostaIA}`);
    console.log(`📤 Enviando resposta para ${from}: ${respostaIA}`);
      historico[from].push({ role: 'assistant', content: respostaIA });

        console.log('Resposta:', respostaIA);

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

        console.log('Enviado para:', from);
    } catch (err) {
      console.error('❌ Erro ao enviar resposta:', err.message);
    }
        })();
      }, 30000);

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
