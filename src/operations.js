import { resolve } from 'node:path';
import { currentDir } from './navigation.js';
import { createReadStream } from 'node:fs';
import { access, constants } from 'node:fs/promises';

export async function isFileExist(fileName, filePath) {
  try {
    await access(filePath, constants.F_OK);
    return  true;
  } catch (err) {
    console.error(`File "${fileName}" does not exist or cannot be accessed. Try another one`);
  }
}

export async function cat(fileName) {
  const filePath = resolve(currentDir, fileName);

  if (!(await isFileExist(fileName, filePath))) return;

  return new Promise((resolvePromise, reject) => {
    const readStream = createReadStream(filePath, { encoding: 'utf8' });

    readStream.pipe(process.stdout, { end: false });

    readStream.on('end', () => {
      process.stdout.write(`\n============  The end of \"${fileName}\"  ==============\n`);
      resolvePromise('');
    });

    readStream.on('error', (err) => {
      console.error(`Error reading file: ${err.message}`);
      reject(err);
    });
  });
}
