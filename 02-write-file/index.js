const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin, stdout } = require('process');

const rl = readline.createInterface(stdin);
const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Hi! How are you?\nPlease enter your answer:\n');

rl.on('line', (line) => {
  if (line === 'exit') {
    stdout.write('Thank you! Bye!\n');
    process.exit();
  }
  stream.write(`${line}`);
});

process.on('SIGINT', () => {
  stdout.write('Thank you! Bye!\n');
  process.exit();
});
