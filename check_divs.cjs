const fs = require('fs');
const lines = fs.readFileSync('src/components/layout/Footer.jsx', 'utf8').split('\n');
let depth = 0;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const o = (l.match(/<div/g) || []).length;
  const c = (l.match(/<\/div>/g) || []).length;
  depth += o - c;
  if (o || c) console.log('L' + (i+1) + ': +' + o + ' -' + c + ' depth=' + depth);
}
console.log('Final depth:', depth);
