const { getRespostaPersonalizada } = require("./respostas");

async function handleIncomingMessage(message) {
  const texto = message?.text?.body?.toLowerCase() || "";

  const resposta = await getRespostaPersonalizada(texto);

  return resposta;
}

module.exports = { handleIncomingMessage };