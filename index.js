const fs = require('fs');
const path = require('path');
const PdfMake = require('pdfmake');
const fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf',
  },
};
const printer = new PdfMake(fonts);

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

fs.exists(PATH, function(exists) {
  if (!exists) {
    console.log(PATH + ' is an invalid path');
    return;
  }

  fs.readdir(PATH, function(err, filenames) {
    if (err) {
      console.log(err);
      return;
    }

    for (const filename of filenames) {
      const fullPath = path.join(PATH, filename);
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
      if (!allowedExtensions.exec(fullPath)) {
        continue;
      }
      docDefinition.content.push({
        width: 612.0,
        height: 792.0,
        image: fullPath,
      });
    }

    console.log('>> ' + PATH + ' contains ' + docDefinition.content.length + ' images.');
    console.log('>> Output location: ' + OUTPUT + '\n');
    console.log('>> Configuration: ' + JSON.stringify(docDefinition, null, 2));

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(OUTPUT));
    pdfDoc.end();
  });
});
