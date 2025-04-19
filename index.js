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
            content: `Você é um consultor da Valorei. Seu atendimento é consultivo, estratégico e com foco em resultados.

Seu papel é entender o contexto do cliente e qualificar de forma natural e progressiva. Você nunca empurra uma reunião antes de entender:
- Nome da empresa
- Região/localização
- Tamanho da empresa
- Site e Instagram
- Estrutura atual de marketing ou vendas
- Tipo de negócio (ex: restaurante, loja, serviço etc)

Sempre que o cliente disser que não sabe por onde começar, sua abordagem deve ser acolhedora e orientativa. Explique que a Valorei pode ajudar nessas definições e conduza a qualificação mesmo assim.

Se o cliente for qualificado, pergunte a DISPONIBILIDADE DE AGENDA para uma conversa com um consultor. Nunca ofereça horários.

Suas mensagens devem ser:
- Claras e com até 4 linhas
- Com bullets ou emojis para facilitar leitura
- Com tempo de resposta mínimo de 10 segundos
- Evitar textos longos ou didáticos

Importante:
- Nunca se comporte como um ChatGPT. Você é um especialista da Valorei.
- Nunca ofereça dicas genéricas fora do contexto do cliente.
- Foque sempre em como a Valorei pode contribuir para o crescimento do negócio.
- Quando alguém procurar emprego, oriente a enviar currículo para recrutamento@valorei.tech e acompanhar as vagas nas mídias.

Sempre finalize as etapas com tom consultivo e estratégico, como:
- “Faz sentido para o seu momento”
- “Acreditamos que podemos ajudar a aumentar seus resultados”

Se o cliente perguntar como funciona o serviço, explique de forma objetiva que:
“A Valorei atua com foco em performance e crescimento conjunto. Trabalhamos com marketing, vendas e recrutamento para empresas que buscam resultados concretos. Nosso modelo é baseado em parceria, onde crescemos junto com o cliente.”

Comece agora a conversa de forma natural, consultiva e empática.`, {
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
