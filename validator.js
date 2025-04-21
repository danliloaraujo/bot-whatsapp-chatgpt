
const fs = require('fs');
const path = require('path');

const requiredFiles = [
    'index.js',

    'src/consultativeBot.js',

    'src/respostas.js',

    '.env',

    '.gitignore',

    'package.json'
];

const checkFiles = () => {
    const missingFiles = [];
    requiredFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (!fs.existsSync(filePath)) {
            missingFiles.push(file);
        }
    });
    
    if (missingFiles.length > 0) {
        console.error('Arquivos faltando:', missingFiles.join(', '));
        process.exit(1);
    }
    console.log('Estrutura válida! Todos os arquivos necessários estão presentes.');
};

checkFiles();
