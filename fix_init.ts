import * as fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/localStorage\.getItem\("office"\) \|\| "ការិយាល័យអប់រំយុវជន និងកីឡាស្រុកក្រគរ"/g, 'localStorage.getItem("office") || ""');
code = code.replace(/localStorage\.getItem\("school"\) \|\| "សាលាបឋមសិក្សាអូរតាប្រុក"/g, 'localStorage.getItem("school") || ""');
code = code.replace(/localStorage\.getItem\("topic"\) \|\| "ការបំពេញស្ដង់ដាសាលាគំរូ"/g, 'localStorage.getItem("topic") || ""');
code = code.replace(/localStorage\.getItem\("lunarDate"\) \|\| "ថ្ងៃព្រហស្បតិ៍ ០៤រោច ខែជេស្ឋ ឆ្នាំរោង"/g, 'localStorage.getItem("lunarDate") || ""');
code = code.replace(/localStorage\.getItem\("date"\) \|\| "2026-06-04"/g, 'localStorage.getItem("date") || ""');
code = code.replace(/localStorage\.getItem\("startTime"\) \|\| "08:30"/g, 'localStorage.getItem("startTime") || ""');
code = code.replace(/localStorage\.getItem\("endTime"\) \|\| "21:40"/g, 'localStorage.getItem("endTime") || ""');
code = code.replace(/localStorage\.getItem\("location"\) \|\| "តាមរយៈ Google Meet"/g, 'localStorage.getItem("location") || ""');
code = code.replace(/localStorage\.getItem\("chair"\) \|\| "លួន សុផាត"/g, 'localStorage.getItem("chair") || ""');
code = code.replace(/localStorage\.getItem\("secretary"\) \|\| "អ៊ិត ថាត"/g, 'localStorage.getItem("secretary") || ""');
code = code.replace(/localStorage\.getItem\("agenda"\) \|\| "១\. ចុះវត្តមាន \(https:\/\/forms\.gle\/H9xzUHHYmdHiKTC59\)\\n២\. មតិសំណេះសំណាលរបស់លោកនាយកសាលារៀន\\n៣\. បទបង្ហាញស្ដីពីវឌ្ឍនភាពការបំពេញស្តង់ដាសាលាគំរូ"/g, 'localStorage.getItem("agenda") || ""');

fs.writeFileSync('src/App.tsx', code);
console.log("Replaced defaults");
