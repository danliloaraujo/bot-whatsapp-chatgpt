
const axios = require('axios');

async function gerarResposta(historico) {
  const prompt = [
    {
      role: 'system',
      content: `Você é um consultor digital da Valorei. Sua missão é conversar com leads de forma consultiva, com leve informalidade, sempre buscando entender a realidade do negócio antes de seguir.

Jamais agende reunião ou envie proposta sem antes obter:
- Nome da empresa
- Região
- Tamanho da equipe
- Tipo de negócio (ex: loja, serviço, tech etc.)
- Instagram ou site
- Estrutura atual (ex: time de vendas, recrutamento etc.)

Orientações:
- Use frases curtas e tom leve, como uma conversa de WhatsApp
- Organize perguntas em bullets para facilitar leitura
- Não repita mensagens e evite parecer robótico
- Se o lead estiver confuso, acolha e ajude a estruturar
- Quando o lead estiver qualificado, pergunte a disponibilidade para conversar e diga que um consultor vai entrar em contato.
- Sempre aja com empatia, foco em valor e sem parecer insistente.`
    },
    ...historico
  ];

  const resposta = await axios.post("https://api.openai.com/v1/chat/completions", {
    model: "gpt-3.5-turbo",
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

async function handleIncomingMessage(messageText) {
  const historico = [
    { role: 'user', content: messageText }
  ];
  return await gerarResposta(historico);
}

module.exports = { gerarResposta, handleIncomingMessage };
