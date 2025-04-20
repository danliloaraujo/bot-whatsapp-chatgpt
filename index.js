
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
let timers = {};
let lastMessageTime = {};
let mensagensProcessadas = new Set(); // Controle de duplicidade

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

app.post('/webhook', async (req, res) => {
  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  console.log("📥 Mensagem recebida:", message);
  const from = message?.from;
  const text = message?.text?.body;
  const messageId = message?.id;

  if (!from || !text || !messageId) return res.sendStatus(200);

  if (mensagensProcessadas.has(messageId)) {
    console.log("🔁 Mensagem duplicada ignorada:", messageId);
    return res.sendStatus(200);
  }

  mensagensProcessadas.add(messageId);
            const ultimoAssistantIndex = historicoCompleto.map(m => { return m.role; }).lastIndexOf("assistant");

  if (!historico[from]) historico[from] = [];
  historico[from].push({ role: 'user', content: text });

    if (timers[from]) clearTimeout(timers[from]);
    if (timers[from]) clearTimeout(timers[from]);
    if (executandoResposta[from]) return;
    executandoResposta[from] = true;
    timers[from] = setTimeout(async () => {
        try {
            const historicoCompleto = historico[from] || [];
            const mensagensRecentes = historicoCompleto.slice(ultimoAssistantIndex + 1)
              .filter(m => { return m.role === "user"; })
              .map(m => { return m.content; })
              .reduce((acc, cur) => { return acc + "\n" + cur; }, "");
            const mensagensRecentes = historicoCompleto.slice(ultimoAssistantIndex + 1)
              .filter(m => { return m.role === "user"; })
              .map(m => { return m.content; })
              .reduce((acc, cur) => { return acc + "\n" + cur; }, "");
            const respostaIA = await gerarResposta(historicoFinal);
  console.log("💬 Resposta gerada:", respostaIA);
            historico[from].push({ role: "assistant", content: respostaIA });
            const delayTime = Math.min(Math.max(respostaIA.length * 15, 10000), 20000);
            await delay(delayTime);
            await axios.post(
                `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
                {
                    messaging_product: "whatsapp",
                    to: from,
                    text: { body: respostaIA }
                },
                {
                    headers: {
                        Authorization: `Bearer ${ACCESS_TOKEN}`,
                        "Content-Type": "application/json"
                    }
                }
            console.log("📤 Enviando resposta via WhatsApp...");
                `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
                {
                    messaging_product: "whatsapp",
                    to: from,
                    text: { body: respostaIA }
                },
                {
                    headers: {
                        Authorization: `Bearer ${ACCESS_TOKEN}`,
                        "Content-Type": "application/json"
                    }
                }
        } catch (err) {
            console.error("❌ Erro ao enviar resposta:", err.message);
        } finally {
            executandoResposta[from] = false;
        }
    }, 30000);

  try {
    const currentTime = Date.now();
    const timeSinceLast = currentTime - (lastMessageTime[from] || 0);
    const resetDelay = 30000;
    if (timeSinceLast > resetDelay) {
      lastMessageTime[from] = currentTime;
    }

    historico[from].push({ role: 'assistant', content: respostaIA });

    const delayTime = Math.min(Math.max(respostaIA.length * 15, 10000), 20000);
    await delay(Math.max(delayTime, resetDelay));

    await axios.post(
                `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
                {
                    messaging_product: "whatsapp",
                    to: from,
                    text: { body: respostaIA }
                },
                {
                    headers: {
                        Authorization: `Bearer ${ACCESS_TOKEN}`,
                        "Content-Type": "application/json"
                    }
                }
            console.log("📤 Enviando resposta via WhatsApp...");
  console.log("📤 Enviando resposta via WhatsApp...");
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
  } catch (err) {
    console.error("❌ Erro ao enviar resposta:", err.message);
  }

  res.sendStatus(200);
});


app.post("/webhook", async (req, res) => {
  console.log("✅ Webhook recebido:", JSON.stringify(req.body, null, 2));
  const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message || message.type !== "text") return res.sendStatus(200);
  const from = message.from;
  const text = message.text.body;
  const id = message.id;
  if (!from || !text || !id) return res.sendStatus(200);
  if (mensagensProcessadas.has(id)) return res.sendStatus(200);
  mensagensProcessadas.add(id);
  if (!historico[from]) historico[from] = [];
  historico[from].push({ role: "user", content: text });
  if (timers[from]) clearTimeout(timers[from]);
  if (executandoResposta[from]) return;
  executandoResposta[from] = true;
  timers[from] = setTimeout(async () => {
    try {
      const historicoCompleto = historico[from];
      const ultimoAssistantIndex = historicoCompleto.map(m => { return m.role; }).lastIndexOf("assistant");
      const mensagensRecentes = historicoCompleto.slice(ultimoAssistantIndex + 1)
        .filter(m => { return m.role === "user"; })
        .map(m => { return m.content; })
        .reduce((acc, cur) => { return acc + "\n" + cur; }, "");
      const historicoFinal = [
        ...historicoCompleto.slice(0, ultimoAssistantIndex + 1),
        { role: "user", content: mensagensRecentes }
      ];
      const respostaIA = await gerarResposta(historicoFinal);
      historico[from].push({ role: "assistant", content: respostaIA });
      console.log("💬 Resposta gerada:", respostaIA);
      const delayTime = Math.min(Math.max(respostaIA.length * 15, 10000), 20000);
      await delay(delayTime);
      await axios.post(
        `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: respostaIA }
        },
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json"
          }
        }
      );
      console.log("📤 Enviando resposta via WhatsApp...");
    } catch (err) {
      console.error("❌ Erro ao enviar resposta:", err.message);
    } finally {
      executandoResposta[from] = false;
    }
  }, 30000);
  res.sendStatus(200);
});
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
