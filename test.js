const fs = require('fs');
const fileBuf = fs.readFileSync('./bip39_russian.txt');
const content = fileBuf.toString('utf8');
const words = content.split('\n');
const longWords = words.filter(w => w.length <4);
console.log(longWords);