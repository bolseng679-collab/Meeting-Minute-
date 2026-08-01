import * as fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<input type="text" value=\{ministry\} /g, '<input type="text" placeholder="ឧ. ក្រសួងអប់រំ យុវជន និងកីឡា" value={ministry} ');
code = code.replace(/<input type="text" value=\{office\} /g, '<input type="text" placeholder="ឧ. ការិយាល័យអប់រំយុវជន និងកីឡាស្រុកក្រគរ" value={office} ');
code = code.replace(/<input type="text" value=\{school\} /g, '<input type="text" placeholder="ឧ. សាលាបឋមសិក្សាអូរតាប្រុក" value={school} ');
code = code.replace(/<input type="text" value=\{topic\} /g, '<input type="text" placeholder="ឧ. ការបំពេញស្ដង់ដាសាលាគំរូ" value={topic} ');
code = code.replace(/<input type="text" value=\{lunarDate\} /g, '<input type="text" placeholder="ឧ. ថ្ងៃព្រហស្បតិ៍ ០៤រោច ខែជេស្ឋ ឆ្នាំរោង" value={lunarDate} ');
// date, startTime, endTime already use appropriate inputs maybe?
// location, chair, secretary
code = code.replace(/<input type="text" value=\{location\} /g, '<input type="text" placeholder="ឧ. តាមរយៈ Google Meet" value={location} ');
code = code.replace(/<input type="text" value=\{chair\} /g, '<input type="text" placeholder="ឧ. លួន សុផាត" value={chair} ');
code = code.replace(/<input type="text" value=\{secretary\} /g, '<input type="text" placeholder="ឧ. អ៊ិត ថាត" value={secretary} ');

code = code.replace(/<textarea value=\{agenda\} /g, '<textarea placeholder="ឧ. ១. ចុះវត្តមាន\n២. មតិសំណេះសំណាល\n៣. បទបង្ហាញ" value={agenda} ');
code = code.replace(/<textarea value=\{content\} /g, '<textarea placeholder="ទីនេះអ្នកអាចសរសេរខ្លឹមសារ..." value={content} ');
code = code.replace(/<textarea value=\{decision\} /g, '<textarea placeholder="សេចក្ដីសម្រេច..." value={decision} ');

fs.writeFileSync('src/App.tsx', code);
console.log("Added placeholders");
