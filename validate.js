
console.log("* Iniciando validação do projeto...");

const fs = require("fs");

function checkFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Arquivo ausente: ${filePath}`);
    process.exit(1);
  }
}

function checkFolderExists(folderPath) {
  if (!fs.existsSync(folderPath) || !fs.lstatSync(folderPath).isDirectory()) {
    console.error(`❌ Pasta ausente ou inválida: ${folderPath}`);
    process.exit(1);
  }
}

// Estrutura esperada
checkFolderExists("./");
checkFileExists("index.js");
checkFileExists("package.json");
checkFileExists(".env");
checkFileExists("respostas.js");
checkFileExists("consultativeBot.js");
checkFileExists("validator.js");

console.log("✅ Estrutura validada com sucesso.");
