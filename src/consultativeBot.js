
require('dotenv').config();
const axios = require('axios');

async function simulateBot({ nome, mensagens, contexto }) {
  const prompt = mensagens.join('\n');
  const resposta = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }]
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  const texto = resposta.data.choices[0].message.content;
  return { texto, contexto };
}

module.exports = simulateBot;
