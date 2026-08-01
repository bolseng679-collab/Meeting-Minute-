import * as fs from 'fs';

let code = fs.readFileSync('src/exportWord.ts', 'utf8');

// Fixing the duplicates created by the previous script
code = code.replace(/size: \d+, font: "Khmer OS Muol Light", size: 26/g, 'size: 26, font: "Khmer OS Muol Light"');
code = code.replace(/size: \d+, bold: true, font: "Khmer OS Muol Light", size: 26/g, 'size: 26, bold: true, font: "Khmer OS Muol Light"');
code = code.replace(/size: \d+, font: "Khmer OS System", size: 22/g, 'size: 22, font: "Khmer OS System"');
code = code.replace(/font: "Khmer OS System", size: 22, size: 22/g, 'font: "Khmer OS System", size: 22');

fs.writeFileSync('src/exportWord.ts', code);
console.log('Done cleaning!');
