
module.exports = {
  saudacaoInicial: (nome) => {
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  if (nome) {
    return `${saudacao}, ${nome}! Tudo certo por aí? 👋

Sou o Rei, consultor digital da Valorei.

Antes da gente seguir, posso te fazer algumas perguntas rápidas? Assim consigo entender melhor seu momento e te ajudar de verdade 😉`;
  } else {
    return `${saudacao}! Tudo certo por aí? 👋

Sou o Rei, consultor digital da Valorei.

Antes da gente seguir, posso saber seu nome? Assim consigo personalizar nossa conversa e te ajudar de verdade 😉`;
  }
},

  erroGeracao: 'Tivemos um erro ao processar sua mensagem. Pode tentar novamente em instantes? 🙏',

  mensagemGenerica: 'Recebi sua mensagem! Me dá só um tempinho pra interpretar direitinho e já volto com uma resposta personalizada 😊',

  encerramento: 'Obrigado por conversar com a Valorei! Se quiser retomar depois, é só mandar uma nova mensagem por aqui. 💬',

  aguardandoResposta: 'Fico no aguardo. Assim que você me responder, seguimos juntos, combinado? 😉',

  coletaNome: 'Antes da gente começar, posso saber seu nome? Assim consigo personalizar melhor a conversa 🤝'
};
