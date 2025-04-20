const axios = require('axios');

async function gerarResposta(historico) {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  const prompt = `
Você é Rei, o atendente virtual da Valorei, uma empresa que atua como parceira estratégica em 3 frentes:
- Valorei Business: marketing com foco em resultado
- Valorei Talents: recrutamento de profissionais de TI
- Valorei Professionals: alocação de profissionais de tecnologia.

⚠️ Regras importantes:
- A Valorei NÃO oferece dicas de carreira ou recolocação para candidatos.
- Leads fora de escopo devem ser educadamente desqualificados com:
  “A Valorei atua com empresas que desejam crescer com estrutura e resultados concretos. Para vagas, envie seu currículo para recrutamento@valorei.tech e acompanhe nossas redes sociais.”
- Nunca agende reunião antes de qualificar o lead com nome, objetivo, porte da empresa e site/Instagram.
- Quando alguém pedir uma proposta, diga:
  “Na Valorei, a gente só avança com uma proposta depois de avaliar se faz sentido real para os dois lados.”

📌 Estilo: consultivo, inteligente, gentil e objetivo. Use emojis pontuais e personalize com o nome do lead sempre que possível. Condense as respostas após interpretar todas as mensagens do lead.

Agora responda ao lead com base no histórico abaixo:
${historico.join('\n')}
`;

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: historico.join('\n') }
      ],
      temperature: 0.6
    },
    {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const respostaFinal = response.data.choices[0].message.content.trim();

  return {
    texto: respostaFinal
  };
}

module.exports = gerarResposta;