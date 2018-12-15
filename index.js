const fs = require('fs');
const path = require('path');
const factory = require('./pdfFactory');

const args = process.argv.slice(2);
const isCompressed = args.includes('--compress') || args.includes('-c');

/**
 * Print help document for assistance in using it
 */
function printHelpDoc() {
  console.log('index.js [options] imagesFolder output.pdf');
  console.log('   --help, -h          Help Documentation');
  console.log('   --compress, -c      Compression disabled by default');
}

const isHelp = args.includes('--help') || args.includes('-h');
if (isHelp) {
  printHelpDoc();
  return;
}

const pathIndex = args.findIndex(function(value) {
  return fs.existsSync(value);
});
const outputFileIndex = args.findIndex(function(value) {
  return value.endsWith('.pdf');
});

if (pathIndex == -1) {
  console.log('Missing images folder.');
  printHelpDoc();
  return;
} else if (outputFileIndex == -1) {
  console.log('Missing output file index.');
  printHelpDoc();
  return;
}

const PATH = args[pathIndex];
const OUTPUT = path.join(PATH, args[outputFileIndex]);

const docDefinition = {
  pageSize: 'LETTER',
  pageMargins: [0, 0, 0, 0],
  compress: isCompressed,
  content: [],
};

factory.create(PATH, OUTPUT, docDefinition);

