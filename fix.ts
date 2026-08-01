import * as fs from 'fs';
let code = fs.readFileSync('src/exportWord.ts', 'utf8');
code = code.replace(/font: "Khmer OS Muol Light", size: 26 \}\)/g, 'font: "Khmer OS Muol Light" })');
fs.writeFileSync('src/exportWord.ts', code);
