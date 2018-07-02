const fs = require('fs');

let dir = fs.readdirSync('./');
let all = '';
dir
    .filter(f => f.endsWith('.tsv'))
    .forEach(f => all += fs.readFileSync(`./${f}`, 'utf8'));

fs.writeFileSync('./all.tsv', all, 'utf8');

