
const axios = require('axios');

async function gerarResposta(historico) {
  const prompt = [
    {
      role: 'system',
      content: `Você é um consultor da Valorei. Seu papel é entender o negócio do cliente, qualificar com perguntas consultivas e só então conduzir para agendamento.

Nunca ofereça proposta ou reunião antes de entender:
- Nome da empresa
- Região
- Tamanho da equipe
- Tipo de negócio
- Site ou Instagram
- Estrutura atual

Evite repetições. Use um tom leve, humano e objetivo. Utilize bullets para facilitar leitura. Quando o lead estiver qualificado, pergunte a disponibilidade de agenda e diga que um consultor entrará em contato.`
    },
    ...historico
  ];

  const resposta = await axios.post("https://api.openai.com/v1/chat/completions", {
    model: "gpt-4",
    messages: prompt,
    temperature: 0.7
  }, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  return resposta.data.choices[0].message.content.trim();
}

// Nova função adicionada para compatibilizar com index.js
async function handleIncomingMessage(messageText) {
  const historico = [
    { role: 'user', content: messageText }
  ];
  return await gerarResposta(historico);
}

module.exports = { gerarResposta, handleIncomingMessage };
