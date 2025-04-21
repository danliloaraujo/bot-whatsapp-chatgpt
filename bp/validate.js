
const fs = require('fs');
const path = require('path');

console.log('* Iniciando validacao do projeto...');

const REQUIRED_FILES = [
  'index.js',

  'package.json',

  '.env',

  'validator.js',

  path.join('src', 'consultativeBot.js'),

  path.join('src', 'respostas.js')
];

let hasError = false;

REQUIRED_FILES.forEach((file) => {
  if (!fs.existsSync(file)) {
    console.error('❌ Arquivo ausente: ' + file);
    hasError = true;
  }
});

if (hasError) {
  process.exit(1);
} else {
  console.log('✅ Validacao concluida com sucesso!');
}
