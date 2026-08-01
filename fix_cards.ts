import * as fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update main cards
code = code.replace(/bg-white p-8 rounded-2xl shadow-sm border border-neutral-200/g, 'bg-white p-6 md:p-10 rounded-2xl md:rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100/60');
code = code.replace(/bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200/g, 'bg-white p-6 md:p-10 rounded-2xl md:rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100/60');

// Update font size of placeholder / generic texts
code = code.replace(/text-\[14\.5px\]/g, 'text-[15px]');

fs.writeFileSync('src/App.tsx', code);
console.log("Updated cards");
