
# Processo de Desenvolvimento do Bot Valorei

## Estrutura Básica

- **index.js**: Lida com o webhook, valida o payload da Meta e envia a resposta.
- **consultativeBot.js**: Função de geração de resposta com IA (OpenAI).
- **respostas.js**: Contém respostas fixas para situações como erro de geração ou saudações.
- **.env**: Variáveis de ambiente para conectar com a API da Meta e OpenAI.

## Padrões do Bot

### 1. Leitura de Mensagens
- O payload do WhatsApp deve ser lido através de `entry[0].changes[0].value.messages[0]`.
- Caso não seja encontrado, o bot deve ignorar a mensagem.

### 2. Respostas Consultivas
- O bot deve usar um tom leve e consultivo, fazendo perguntas sobre o negócio do lead antes de agendar qualquer reunião.
- As respostas devem ser enviadas com **um delay mínimo de 10s**, baseado no tamanho da resposta da IA, podendo chegar até 20s.
- O delay é **resetado** a cada nova mensagem do lead (delay mínimo de 30 segundos).

### 3. Uso de Variáveis de Ambiente
- O arquivo `.env` deve conter:
  - `OPENAI_API_KEY`: chave de acesso da OpenAI
  - `PHONE_NUMBER_ID`: ID do número de WhatsApp da Meta
  - `ACCESS_TOKEN`: token de acesso para a API do WhatsApp da Meta

### 4. Importação de Arquivos
- O arquivo `index.js` deve importar corretamente o `consultativeBot.js` e `respostas.js`.
- Todos os caminhos de importação devem ser **relativos**: `./src/consultativeBot`.

### 5. Tratamento de Erros
- O código deve usar `try/catch` para tratar erros da API do WhatsApp e da OpenAI.
- **Mensagens padrão de erro** devem ser utilizadas quando a IA falhar.

---

## Validação do Processo

1. **Validador de Estrutura**: Um script `validator.js` deve ser executado antes de gerar o ZIP para garantir que todos os arquivos necessários estão presentes e corretamente configurados.
2. **Revisão de Código**: Cada arquivo deve ser revisado **3 vezes** antes de ser enviado, garantindo que a lógica e a estrutura estão consistentes.

