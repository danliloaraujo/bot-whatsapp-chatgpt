
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const token = process.env.WHATSAPP_TOKEN;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.post('/webhook', async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const message = changes?.value?.messages?.[0];

  if (!message || !message.text || !message.text.body) {
    return res.sendStatus(200);
  }

  const userMsg = message.text.body.toLowerCase();
  const phoneNumberId = changes.value.metadata.phone_number_id;
  const from = message.from;

  console.log("Mensagem recebida:", userMsg);

  let resposta = '';
  let followUp = '';

  // Interpretação e consultoria
  if (userMsg.includes('vender') || userMsg.includes('vendas')) {
    resposta = "Legal! Atualmente você conta com alguma estratégia comercial? Como é seu processo de vendas?";
    followUp = "Acredito que a Valorei possa te ajudar. Podemos agendar uma conversa para entender melhor seus desafios atuais?";
  } else if (userMsg.includes('site')) {
    resposta = "Você já tem um site ativo? Ou está em busca de criar um do zero? Me dá um contexto que consigo te orientar melhor.";
  } else if (userMsg.includes('emprego') || userMsg.includes('currículo')) {
    resposta = "Ah, entendi! A Valorei Talents é focada no recrutamento de profissionais de TI. Você trabalha na área?";
    followUp = "Se sim, posso te direcionar para o nosso formulário de candidatura.";
  } else {
    resposta = "Legal! Posso te ajudar com estratégias de vendas, marketing ou recrutamento tech. Me conta um pouco sobre sua empresa ou desafio atual.";
  }

  // Delay natural para resposta (15s)
  await delay(15000);

  await axios.post(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
    messaging_product: 'whatsapp',
    to: from,
    type: 'text',
    text: { body: resposta }
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (followUp) {
    await delay(15000);
    await axios.post(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
      messaging_product: 'whatsapp',
      to: from,
      type: 'text',
      text: { body: followUp }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  res.sendStatus(200);
});

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
