import * as fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/if \(!res\.ok\) \{\s*throw new Error\("ការសង្ខេបបរាជ័យ \(Summarization failed\)"\);\s*\}/g, 
  `if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "ការសង្ខេបបរាជ័យ (Summarization failed)");
      }`);

code = code.replace(/if \(!res\.ok\) \{\s*throw new Error\("ការបង្កើតការបង្ហោះបរាជ័យ \(Generate post failed\)"\);\s*\}/g,
  `if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "ការបង្កើតការបង្ហោះបរាជ័យ (Generate post failed)");
      }`);

code = code.replace(/if \(!res\.ok\) \{\s*throw new Error\("ការរៀបចំរបៀបវារៈបរាជ័យ \(Refining agenda failed\)"\);\s*\}/g,
  `if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "ការរៀបចំរបៀបវារៈបរាជ័យ (Refining agenda failed)");
      }`);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed App.tsx errors');
