require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 10000;
app.use(bodyParser.json());

const historico = {};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

function escolherDelay(resposta) {
    const base = 10000;
    const extra = Math.min(resposta.length * 15, 8000); // até +8s
    return base + extra;
}

app.post('/webhook', async (req, res) => {
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];
    const from = message?.from;
    const text = message?.text?.body;

    if (!from || !text) return res.sendStatus(200);

    if (!historico[from]) historico[from] = [];

    historico[from].push({ role: 'user', content: text });

    const prompt = [
        {
            role: 'system',
            content: `Você é um consultor da Valorei. Seu atendimento é consultivo, humano e focado em qualificar leads de forma natural.
Use tom leve, organize respostas longas em parágrafos ou bullets, aplique pausas (delay simulado), e nunca proponha reuniões sem entender:
- Tamanho da empresa
- Tipo de negócio
- Site ou Instagram
- Estrutura atual

No Valorei Talents e Professionals, também colete: região, job description, número de vagas e perfis.

Fale dos valores da Valorei: crescimento conjunto, cultura de sócio e modelo de sucesso proporcional. Evite soar robótico ou repetitivo.`
        },
        ...historico[from]
    ];

    try {
        const completion = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: prompt
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        const respostaIA = completion.data.choices[0].message.content;

        const tempoEspera = escolherDelay(respostaIA);
        await delay(tempoEspera);

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
    } catch (error) {
        console.error("Erro ao responder:", error.message);
    }

    res.sendStatus(200);
});

app.get('/', (req, res) => {
    res.send("🤖 Bot Valorei consultivo ativo.");
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
