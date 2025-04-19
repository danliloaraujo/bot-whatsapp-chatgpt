
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { getRespostaPersonalizada } = require("./respostas");

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messageData = changes?.value?.messages?.[0];

    if (messageData) {
        const from = messageData.from;
        const texto = messageData.text?.body;

        if (from && texto) {
            const resposta = getRespostaPersonalizada(texto, from);

            try {
                await axios.post(
                    `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`,
                    {
                        messaging_product: "whatsapp",
                        to: from,
                        text: { body: resposta }
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                        }
                    }
                );
            } catch (erro) {
                console.error("Erro ao enviar mensagem:", erro.response?.data || erro.message);
            }
        }
    }

    res.sendStatus(200);
});

app.get("/", (req, res) => {
    res.send("Servidor Valorei IA rodando com sucesso.");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
