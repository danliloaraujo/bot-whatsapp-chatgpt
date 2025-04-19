
function gerarResposta(mensagem) {
  if (/oi|ol[aá]/i.test(mensagem)) {
    return "Oi! Tudo bem? Antes da gente seguir, posso saber seu nome? 😊";
  }
  if (/venda|comercial|aumentar/i.test(mensagem)) {
    return "Legal saber que você nos encontrou no Instagram! Para te ajudar a aumentar suas vendas, posso fazer algumas perguntas para entender melhor a sua situação. Você já tem alguma estratégia de vendas em andamento? E qual é o seu principal desafio no momento para aumentar as vendas?";
  }
  return "Perfeito! Para que eu possa te ajudar melhor, posso te fazer algumas perguntas rápidas sobre o seu negócio? 💬";
}

module.exports = { gerarResposta };
