import * as fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update labels
code = code.replace(/text-gray-600 mb-1/g, 'text-slate-700 font-medium mb-1.5');
code = code.replace(/text-gray-600 mb-2/g, 'text-slate-700 font-medium mb-2');
code = code.replace(/text-gray-600"/g, 'text-slate-700 font-medium"');

// Update Inputs
code = code.replace(/rounded-md border-gray-300 border px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500/g, 'rounded-xl border-slate-200 border px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm transition-all text-slate-800 placeholder:text-slate-400');

// Update other UI to indigo for consistency
code = code.replace(/text-blue-600/g, 'text-indigo-600');
code = code.replace(/border-blue-300/g, 'border-indigo-300');
code = code.replace(/bg-blue-600 hover:bg-blue-700/g, 'bg-indigo-600 hover:bg-indigo-700');

fs.writeFileSync('src/App.tsx', code);
console.log("Updated inputs and colors to slate/indigo");
