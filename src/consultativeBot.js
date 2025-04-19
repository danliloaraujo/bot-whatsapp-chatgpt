module.exports = async function handleIncomingMessage(message) {
  return "Mensagem recebida: " + message.text?.body;
};