import fs from 'node:fs';
let content = fs.readFileSync('src/data/privacyPolicyHtml.js', 'utf8');
content = content.replace(/3 july 2026/g, '3rd July, 2026');
fs.writeFileSync('src/data/privacyPolicyHtml.js', content);
console.log('Date fixed!');
