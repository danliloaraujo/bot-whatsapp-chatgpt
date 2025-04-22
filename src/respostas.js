module.exports = {
  saudacaoInicial: (nome) => {
    const agora = new Date();
    const horaBrasilia = new Date(agora.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
    const hora = horaBrasilia.getHours();
    const saudacao = hora < 5 ? 'Boa noite' : hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

    if (nome) {
      return `${saudacao}, ${nome}! Tudo certo por aí? 👋

Sou o Rei, consultor digital da Valorei.

Antes da gente seguir, posso te fazer algumas perguntas rápidas? Assim consigo entender melhor seu momento e te ajudar de verdade 😉`;
    } else {
      return `${saudacao}! Tudo certo por aí? 👋

Sou o Rei, consultor digital da Valorei.

Antes da gente seguir, posso saber seu nome? Assim consigo personalizar nossa conversa e te ajudar de verdade 😉`;
    }
  }
};
