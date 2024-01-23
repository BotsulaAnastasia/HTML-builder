const fsPromises = require('fs/promises');
const path = require('path');

const pathToFolder = path.join(__dirname, 'files');
const pathToCopyFolder = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fsPromises.rm(pathToCopyFolder, { recursive: true, force: true });
    await fsPromises.mkdir(pathToCopyFolder, { recursive: true });
    console.log('Copy directory created successfully!');
    const files = await fsPromises.readdir(pathToFolder, {
      withFileTypes: true,
    });
    files.forEach((file) => {
      const pathToFile = path.join(pathToFolder, file.name);
      const pathToCopyFile = path.join(pathToCopyFolder, file.name);
      fsPromises.copyFile(pathToFile, pathToCopyFile);
    });
  } catch (err) {
    console.error(err);
  }
}

copyDir();
