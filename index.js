require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];
    const from = message?.from;
    const text = message?.text?.body;

    if (!from || !text) {
        return res.sendStatus(200);
    }

    console.log("Mensagem recebida:", text);

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'Você é um atendente da Valorei com tom consultivo e humano, vendendo serviços de marketing e recrutamento, sempre coletando informações do cliente antes de sugerir reunião.' },
                { role: 'user', content: text }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        const respostaIA = response.data.choices[0].message.content;

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
    } catch (error) {
        console.error("Erro ao responder mensagem:", error.message);
    }

    res.sendStatus(200);
});

app.get('/', (req, res) => {
    res.send("Servidor rodando com IA consultiva na porta " + port);
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});