import * as fs from 'fs';

let code = fs.readFileSync('src/exportWord.ts', 'utf8');

code = code.replace(/size: 30/g, 'size: 22');
code = code.replace(/size: 32/g, 'size: 24');
code = code.replace(/size: 34/g, 'size: 26');
code = code.replace(/size: 36/g, 'size: 28');

code = code.replace(/font: "Khmer OS System" \}\)/g, 'font: "Khmer OS System", size: 22 })');
code = code.replace(/font: "Khmer OS Muol Light" \}\)/g, 'font: "Khmer OS Muol Light", size: 26 })');

fs.writeFileSync('src/exportWord.ts', code);
console.log('Done!');
