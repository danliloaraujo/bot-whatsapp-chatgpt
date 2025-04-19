
const axios = require('axios');

async function gerarResposta(historico) {
  try {
    const prompt = [
      {
        role: 'system',
        content: `Você é um consultor digital da Valorei. Seu papel é entender o negócio do lead, qualificar antes de agendar reuniões e ser leve, consultivo e objetivo.

Jamais agende reunião sem saber:
- Nome da empresa
- Região
- Tamanho da equipe
- Tipo de negócio
- Instagram ou site
- Estrutura atual (vendas, recrutamento etc)

Sempre use:
- Tom humano, leve e consultivo
- Bullets para organizar
- Emojis moderados
- Frases diretas e curtas

Ajude o lead confuso. Quando qualificado, pergunte a disponibilidade e avise que um consultor vai entrar em contato.`
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
  } catch (error) {
    console.error("❌ Erro na geração de resposta da IA:", error.message);
    return "Tivemos um probleminha ao gerar a resposta. Pode tentar de novo em instantes? 🙏";
  }
}

module.exports = { gerarResposta };
