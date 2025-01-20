const fs = require('fs');
const path = require('path');

const pathToDist = path.join(__dirname, 'project-dist');

fs.mkdir(pathToDist, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
});

function mergeStyles() {
  const pathToStylesFolder = path.join(__dirname, 'styles');
  
  fs.readdir(pathToStylesFolder, { withFileTypes: true }, (err, files) => {
    if (err) console.error(err);
    const writeStream = fs.createWriteStream(
      path.join(pathToDist, 'style.css'),
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
}

mergeStyles();

async function copyAssets() {
  const pathToAssets = path.join(__dirname, 'assets');
  const pathToDistAssets = path.join(pathToDist, 'assets');

  try {
    await fs.promises.rm(pathToDistAssets, { recursive: true, force: true });
    await fs.promises.mkdir(pathToDistAssets, { recursive: true });

    const folders = await fs.promises.readdir(pathToAssets, {
      withFileTypes: true,
    });

    folders.forEach((folder) => {
      fs.promises.mkdir(path.join(pathToDistAssets, folder.name), { recursive: true });
    
      const pathToFolder = path.join(pathToAssets, folder.name);
      const pathToDistFolder = path.join(pathToDistAssets, folder.name);

      const files = fs.promises.readdir(pathToFolder, {
        withFileTypes: true,
      }).then(files => {
        for (let file of files) {
          const pathToFile = path.join(pathToFolder, file.name);
          const pathToCopyFile = path.join(pathToDistFolder, file.name);
          fs.promises.copyFile(pathToFile, pathToCopyFile);
        }
      });
    });

  } catch (err) {
    console.error(err);
  }
}

copyAssets();

async function createHTML() {
  const pathToTemplate = path.join(__dirname, 'template.html');
  const pathToDistTemplate = path.join(pathToDist, 'index.html');

  await fs.promises.copyFile(pathToTemplate, pathToDistTemplate);
  let template = await fs.promises.readFile(pathToDistTemplate, 'utf-8');

  const pathToComponents = path.join(__dirname, 'components');
  const files = await fs.promises.readdir(pathToComponents, {
    withFileTypes: true
  });

  for (let file of files) {
    const pathToFile = path.join(pathToComponents, file.name);
    const fileExt = path.extname(pathToFile);

    if (file.isFile()) {
      const content = await fs.promises.readFile(pathToFile, 'utf-8');
      const name = file.name.replace(fileExt, '');
      template = template.replace(`{{${name}}}`, content);

      fs.promises.writeFile(pathToDistTemplate, template);
    }
  }
}

createHTML();
