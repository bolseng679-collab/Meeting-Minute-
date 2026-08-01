import fs from "fs";
let data = fs.readFileSync('server.ts', 'utf8');
data = data.replace(/gemini-2\.5-flash/g, 'gemini-2.5-flash-lite');
fs.writeFileSync('server.ts', data);
console.log("Done");
