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

/**
 * Create a pdf from a list of images in the directory
 * @param {*} PATH
 * @param {*} OUTPUT
 * @param {*} docDefinition
 */
function create(PATH, OUTPUT, docDefinition) {
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
        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
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
}

module.exports = {
  create: create,
};
