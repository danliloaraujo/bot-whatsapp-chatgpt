require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

const historico = {};

const delay = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.post('/webhook', async (req, res) => {
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];
    const from = message?.from;
    const text = message?.text?.body;

    if (!from || !text) return res.sendStatus(200);

    // iniciar histórico se necessário
    if (!historico[from]) historico[from] = [];

    historico[from].push({ role: 'user', content: text });

    const prompt = [
        { role: 'system', content: 'Você é um consultor inteligente e gentil da Valorei, que atua com marketing, vendas e recrutamento tech. Você qualifica leads com perguntas progressivas, mantendo um tom humano, informal e consultivo. Nunca agenda uma conversa sem entender o momento do cliente, e só sugere uma reunião se o lead estiver claramente qualificado. Use pausas e responda de forma leve, como um humano da Valorei faria. Quando possível, destaque os valores da Valorei como parceria, cultura de sócio, personalização e entrega por resultado. Sempre pense com naturalidade e inteligência.' },
        ...historico[from]
    ];

    try {
        const completion = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: prompt
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        const respostaIA = completion.data.choices[0].message.content;

        await delay(10000); // 10 segundos para simular naturalidade

        await axios.post(`https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
            messaging_product: 'whatsapp',
            to: from,
            text: { body: respostaIA }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`
            }
        });

        historico[from].push({ role: 'assistant', content: respostaIA });
    } catch (err) {
        console.error("Erro ao responder:", err.message);
    }

    res.sendStatus(200);
});

app.get('/', (req, res) => {
    res.send("Bot consultivo da Valorei rodando.");
});

app.listen(port, () => {
    console.log("Servidor ativo na porta " + port);
});
