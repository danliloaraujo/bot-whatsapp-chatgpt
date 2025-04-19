const axios = require('axios');

async function gerarResposta(historico) {
  const mensagens = [
    {
      role: 'system',
      content: \`Você é um atendente da Valorei. Sempre qualifique o lead antes de sugerir reuniões.
- Nome da empresa
- Região
- Tamanho da equipe
- Tipo de negócio
- Instagram ou site
Evite respostas longas e evite repetir saudações. Use bullets e conduza para reunião apenas se o lead estiver qualificado. Reforce que a Valorei só apresenta proposta depois de entender o negócio.\`
    },
    ...historico
  ];

  const resposta = await axios.post("https://api.openai.com/v1/chat/completions", {
    model: "gpt-4",
    messages: mensagens,
    temperature: 0.7
  }, {
    headers: {
      Authorization: \`Bearer \${process.env.OPENAI_API_KEY}\`,
      'Content-Type': 'application/json'
    }
  });

  return resposta.data.choices[0].message.content.trim();
}

module.exports = { gerarResposta };
