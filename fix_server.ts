import * as fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/model: "gemini-[^"]+"/g, 'model: "gemini-2.5-flash"');
code = code.replace(/catch \(error\)/g, 'catch (error: any)');
code = code.replace(/error: "Failed to ([^"]+)"/g, 'error: error?.message || "Failed to $1"');

fs.writeFileSync('server.ts', code);
console.log('Fixed models and error messages');
