const fs = require('fs');
const ttf2woff2 = require('ttf2woff2');

try {
  let inputLine = fs.readFileSync('public/fonts/line.ttf');
  fs.writeFileSync('public/fonts/line.woff2', ttf2woff2(inputLine));
  console.log('Converted line.ttf to line.woff2 successfully.');
} catch (e) {
  console.error('Failed on line.ttf', e);
}

try {
  let inputMirai = fs.readFileSync('public/fonts/mirai.ttf');
  fs.writeFileSync('public/fonts/mirai.woff2', ttf2woff2(inputMirai));
  console.log('Converted mirai.ttf to mirai.woff2 successfully.');
} catch (e) {
  console.error('Failed on mirai.ttf', e);
}
