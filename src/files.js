import { basename, resolve } from 'node:path';
import { currentDir, printCurrentDirectory } from './navigation.js';
import { createReadStream, createWriteStream } from 'node:fs';
import { access, constants, writeFile, mkdir as fsMkdir, rename as fsRename, copyFile, unlink } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';

export async function isFileExist(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return  true;
  } catch (err) {
    console.error(`"${basename(filePath)}" does not exist or cannot be accessed. Try another one`);
    printCurrentDirectory();
  }
}

export async function cat(fileName) {
  const filePath = resolve(currentDir, fileName);

  if (!(await isFileExist(filePath))) return;

  return new Promise((resolvePromise, reject) => {
    const readStream = createReadStream(filePath, { encoding: 'utf8' });

    readStream.pipe(process.stdout, { end: false });

    readStream.on('end', () => {
      process.stdout.write(`\n============  The end of \"${fileName}\"  ==============\n`);
      printCurrentDirectory();
      resolvePromise('');
    });

    readStream.on('error', (err) => {
      console.error(`Error reading file: ${err.message}`);
      reject(err);
    });
  });
}

export async function add(fileName) {
  const filePath = resolve(currentDir, fileName);
  
  try {
    // 'wx' flag ensures the operation fails if the file already exists
    await writeFile(filePath, '', { flag: 'wx' });
    console.log(`File "${fileName}" created successfully.`);
    printCurrentDirectory();
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.error(`File "${fileName}" already exists.`);
    } else {
      console.error(`Error creating file "${fileName}": ${err.message}`);
    }
  }
}
 
export async function mkdir(dirName) {
  const dirPath = resolve(currentDir, dirName);

  try {
    await fsMkdir(dirPath, { recursive: false });
    console.log(`Directory "${dirName}" created successfully.`);
    printCurrentDirectory();
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.error(`Directory "${dirName}" already exists.`);
    } else {
      console.error(`Error creating directory "${dirName}": ${err.message}`);
    }
  }
}

export async function rename(oldName, newName) {
  const oldPath = resolve(currentDir, oldName);
  const newPath = resolve(currentDir, newName);

  try {
    await fsRename(oldPath, newPath);
    console.log(`"${oldName}" has been renamed to "${newName}".`);
    printCurrentDirectory();
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`Operation failed: "${oldName}" does not exist.`);
    } else if (err.code === 'EEXIST') {
      console.error(`Operation failed: "${newName}" already exists.`);
    } else {
      console.error(`Operation failed. Error renaming "${oldName}": ${err.message}`);
    }
  }
 }

export async function copy(filePath, targetDir) {
  const fileName = basename(filePath);
  const path = resolve(currentDir, filePath);
  const destDirPath = resolve(currentDir, targetDir);
  const destPath = resolve(destDirPath, fileName);

  try {    
    if (!(await isFileExist(path))) return;

    if (!(await isFileExist(destDirPath))) return;

    await pipeline(
      createReadStream(path),
      createWriteStream(destPath),
    );
    
    console.log(`File "${fileName}" copied to directory "${targetDir}" successfully.`);
  } catch (err) {    
      console.error(`Error copying file: ${err.message}`);   
  }

  printCurrentDirectory();
}

export async function moveFile(filePath, destDir) {
  const fileName = basename(filePath);
  const path = resolve(currentDir, filePath);
  const destDirPath = resolve(currentDir, destDir);
  const destPath = resolve(destDirPath, fileName);

  try {
    if (!(await isFileExist(path))) return;

    if (!(await isFileExist(destDirPath))) return;

    await pipeline(
      createReadStream(path),
      createWriteStream(destPath)      
    );
    
    await unlink(path); 

    console.log(`File "${fileName}" copied to directory "${destDir}" successfully.`);
  } catch (err) {
    console.error(`Error copying file: ${err.message}`);
  }

  printCurrentDirectory();
}

export async function removeFile(filePath) {
  const path = resolve(currentDir, filePath);
  const fileName = basename(filePath);

  try {
    await unlink(path);
    console.log(`File "${fileName}" has been removed successfully.`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`File "${fileName}" does not exist.`);
    } else {
      console.error(`Error removing file "${fileName}": ${err.message}`);
    }
  }

  printCurrentDirectory();
}
