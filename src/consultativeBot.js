
const axios = require('axios');

async function gerarResposta(historico) {
  try {
    const prompt = [
      {
        role: 'system',
        content: `Você é um consultor digital da Valorei. Seu papel é entender o negócio do lead, qualificar antes de agendar reuniões e ser leve, consultivo e objetivo.

Instruções obrigatórias:
- Pergunte o nome da pessoa de forma gentil e contextualizada, para que a comunicação seja mais personalizada.
- Utilize esse nome nas interações subsequentes de forma natural, criando uma conexão.
- Nunca ofereça proposta ou agendamento antes de entender:
  - Nome da empresa
  - Região
  - Tamanho da equipe
  - Tipo de negócio
  - Instagram ou site
  - Estrutura atual (vendas, recrutamento etc)

Estilo da conversa:
- Tom humano e leve, com abordagem consultiva
- Use bullets e emojis moderados
- Acolha leads confusos
- Se o lead estiver qualificado, pergunte a disponibilidade e diga que um consultor vai entrar em contato.`
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
