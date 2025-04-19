async function getRespostaPersonalizada(texto) {
  if (texto.includes("vaga") || texto.includes("desenvolvedor") || texto.includes("tech") || texto.includes("recrutar")) {
    return `Oi! Que bom que chegou até aqui.

Sim, a gente trabalha com recrutamento tech, mas com foco bem estratégico: mais do que preencher a vaga, nosso objetivo é garantir **qualidade técnica e fit com o seu time**.

Posso te perguntar rapidinho:
- Já tem a descrição da vaga?
- Quantas posições abertas?
- Remoto ou presencial?
- Nome da empresa e site (se tiver)?

Assim consigo te direcionar melhor.`;
  }

  if (texto.includes("alocação") || texto.includes("alocar") || texto.includes("profissionais")) {
    return `Oi! Sim, aqui na Valorei atuamos com alocação sob demanda — sempre com foco em **performance e fit cultural**.

Pra entender melhor o cenário, me conta:
- Qual o perfil técnico?
- Modelo de trabalho (remoto, híbrido…)
- Nome da empresa e site?

Assim já consigo te dar um direcionamento claro :)`;
  }

  if (texto.includes("marketing") || texto.includes("vender") || texto.includes("crescer")) {
    return `Oi! Que bom falar com você.

Antes de sugerir qualquer solução, posso entender um pouco mais?
- Qual o tipo de negócio? (serviço, loja, consultoria…)
- Como funciona hoje a parte comercial?
- Nome da empresa e site?

A gente só propõe algo se fizer sentido de verdade.`;
  }

  if (texto.includes("emprego") || texto.includes("trabalhar")) {
    return `Que legal que tem interesse em trabalhar com a gente!

Você pode enviar seu currículo atualizado para **recrutamento@valorei.tech**  
E também acompanhar novas vagas pelas nossas redes.

Boa sorte :)`;
  }

  return `Legal! Me conta um pouco mais sobre o que você está buscando.

Atuamos com:
- Marketing e vendas para micro e pequenas empresas
- Recrutamento de profissionais de TI
- Alocação de talentos tech sob demanda

Me diz como posso te ajudar!`;
}

module.exports = { getRespostaPersonalizada };