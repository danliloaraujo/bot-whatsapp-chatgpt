const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;
const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0";
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const TOKEN = process.env.TOKEN;

let history = {};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const templates = {
  welcome: (name) => `Olá! Como posso te ajudar hoje?
Seja bem-vindo ao chat da Valorei! 😊`,
  start: () => `Tudo ótimo por aqui, e contigo?
Estou à disposição para te ajudar no que precisar. Como posso contribuir para o crescimento da sua empresa hoje?`,
  askCompany: () => `Legal! Antes de te apresentar os próximos passos, posso te pedir o nome da sua empresa?`,
  askMarketingNeeds: () => `Pra te ajudar melhor, me conta rapidinho:

- Qual o tamanho da sua equipe?
- Qual o ramo do seu negócio?
- Qual o Instagram ou site da empresa?`,
  leadQualified: () => `Perfeito, com base nessas informações acredito que faz sentido marcarmos um bate-papo rápido pra entender mais a fundo e te ajudar a gerar melhores resultados.`,
  askSchedule: () => `Pode me dizer sua disponibilidade de dia/horário? Um consultor vai te chamar conforme sua agenda. 🙂`,
  fallback: () => `Desculpa, não consegui entender exatamente. Você poderia reformular ou me contar mais sobre sua necessidade?`,
  jobSeeking: () => `Obrigado pelo interesse! Se você está buscando uma oportunidade, envie seu currículo para: recrutamento@valorei.tech
E acompanhe as novas vagas nas redes sociais da Valorei! 💼`,
};

async function sendMessage(to, message) {
  await axios.post(
    `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      text: { body: message },
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const message = changes?.value?.messages?.[0];

  if (!message) return res.sendStatus(200);

  const from = message.from;
  const text = message.text?.body?.toLowerCase();
  if (!history[from]) history[from] = [];

  history[from].push(text);

  try {
    if (text.includes("vaga") || text.includes("emprego") || text.includes("trabalho")) {
      await delay(10000);
      await sendMessage(from, templates.jobSeeking());
    } else if (history[from].length === 1) {
      await delay(10000);
      await sendMessage(from, templates.welcome());
    } else if (history[from].length === 2) {
      await delay(10000);
      await sendMessage(from, templates.start());
    } else if (history[from].length === 3) {
      await delay(10000);
      await sendMessage(from, templates.askCompany());
    } else if (history[from].length === 4) {
      await delay(10000);
      await sendMessage(from, templates.askMarketingNeeds());
    } else if (history[from].length === 5) {
      await delay(10000);
      await sendMessage(from, templates.leadQualified());
      await delay(15000);
      await sendMessage(from, templates.askSchedule());
    } else {
      await delay(10000);
      await sendMessage(from, templates.fallback());
    }
  } catch (err) {
    console.error("Erro ao enviar mensagem:", err.message);
  }

  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("Valorei bot is live.");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});