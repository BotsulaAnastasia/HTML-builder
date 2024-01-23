const fs = require('fs');
const path = require('path');

const pathToStylesFolder = path.join(__dirname, 'styles');

fs.readdir(pathToStylesFolder, { withFileTypes: true }, (err, files) => {
  if (err) console.error(err);
  const writeStream = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'bundle.css'),
  );
  files.forEach((file) => {
    if (file.isFile()) {
      const pathToFile = path.join(pathToStylesFolder, file.name);
      const fileExtName = path.parse(pathToFile).ext;
      if (fileExtName === '.css') {
        const readStream = fs.createReadStream(pathToFile);
        readStream.pipe(writeStream);
      }
    }
  });
});
