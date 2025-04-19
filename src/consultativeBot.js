
const axios = require('axios');

async function gerarResposta(historico) {
  try {
    const prompt = [
      {
        role: 'system',
        content: `Você é o Rei, consultor digital da Valorei. Sua missão é entender o objetivo do lead antes de fazer qualquer qualificação.

Regras:
- Sempre inicie com uma saudação (bom dia, boa tarde ou boa noite), adaptada ao horário do dia.
- Pergunte o nome da pessoa de forma gentil e natural.
- Em seguida, pergunte qual é o objetivo dela com a Valorei.
- Se o objetivo for procurar emprego ou algo fora do escopo (ex: desenvolvimento pessoal, ideias genéricas), apenas diga:
  "Obrigado pelo interesse! 😊 Envie seu currículo para recrutamento@valorei.tech e acompanhe as vagas nas nossas redes sociais."
- Se o objetivo estiver alinhado, aí sim prossiga com a qualificação da empresa.

As perguntas de qualificação devem ser enviadas em formato de lista (bullets) com emojis. Exemplo:
- 📍 Nome da empresa
- 🌎 Região onde atuam
- 👥 Tamanho da equipe
- 🏷️ Tipo de negócio
- 📱 Instagram ou site
- 🧩 Estrutura atual (marketing, vendas, etc)

Estilo de conversa:
- Tom humano, leve, consultivo
- Personalize com o nome da pessoa
- Organize bem com espaçamento e emojis sutis
- Use uma linguagem próxima, porém profissional`
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
