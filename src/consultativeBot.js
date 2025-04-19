module.exports = async function simulateBot({ nome, mensagens, contexto }) {
  const tudoJunto = mensagens.join(" ").toLowerCase().trim();

  await new Promise(resolve => setTimeout(resolve, 3000)); // Simula delay de interpretação

  // 1. Fora de escopo
  if (tudoJunto.includes("vaga") || tudoJunto.includes("sou autônomo") || tudoJunto.includes("não tenho empresa") || tudoJunto.includes("currículo")) {
    return {
      texto: "A Valorei atua com empresas que desejam crescer com estrutura e resultados concretos. Você gostaria de saber se seu modelo se encaixa nesse perfil? Para vagas, envie seu currículo para recrutamento@valorei.tech.",
      contexto: { ...contexto, etapa: "fora-escopo" }
    };
  }

  // 2. Forçando proposta
  if (tudoJunto.includes("proposta") || tudoJunto.includes("valor") || tudoJunto.includes("orçamento") || tudoJunto.includes("quanto custa")) {
    return {
      texto: "Sinto muito, mas para poder te enviar uma proposta personalizada, preciso entender melhor o seu modelo de negócio. Na Valorei, a gente só avança com uma proposta depois de avaliar se faz sentido real para os dois lados. Você pode me contar um pouco mais sobre sua empresa?",
      contexto: { ...contexto, etapa: "aguardando-info" }
    };
  }

  // 3. Se ainda não perguntamos o objetivo
  if (!contexto.objetivoPerguntado) {
    contexto.objetivoPerguntado = true;
    return {
      texto: "Legal! 😊 Para poder te ajudar da melhor forma, me conta rapidinho: qual seu objetivo com a Valorei?",
      contexto
    };
  }

  // 4. Default (já respondeu o objetivo)
  return {
    texto: "Ótimo! 😊 Como posso te ajudar exatamente? Qual é a sua área de atuação ou desafio atual para que possamos pensar juntos na melhor solução?",
    contexto
  };
};