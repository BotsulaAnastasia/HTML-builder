const fs = require('fs');
const path = require('path');

const pathToSecretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathToSecretFolder, { withFileTypes: true }, (err, files) => {
  console.log('\nSecret-folder files:\n');
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        const pathToFile = path.join(pathToSecretFolder, file.name);
        const fileName = path.parse(pathToFile).name;
        const fileExtName = path.parse(pathToFile).ext.replace('.', '');

        fs.stat(pathToFile, (err, stats) => {
          if (err) {
            console.log(err);
          } else {
            console.log(
              `${fileName} - ${fileExtName} - ${stats.size / 1000}kb`,
            );
          }
        });
      }
    });
  }
});
