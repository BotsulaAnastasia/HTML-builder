const fs = require('fs');
const path = require('path');

console.log('>> start');

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'));

stream.on('data', (chunk) => console.log(String(chunk)));
stream.on('end', () => console.log('>> end'));
