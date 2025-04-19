
const respostas = require("./respostas");

let buffer = [];
let bufferTimeout;

async function handleIncomingMessage(message) {
  clearTimeout(bufferTimeout);
  buffer.push(message.text?.body || "");

  return new Promise((resolve) => {
    bufferTimeout = setTimeout(() => {
      const fullMessage = buffer.join(" ");
      buffer = [];
      const resposta = respostas.gerarResposta(fullMessage);
      resolve(resposta);
    }, 30000);
  });
}

module.exports = { handleIncomingMessage };
