import os from 'node:os';
import { resolve, extname } from 'node:path';
import { promises as fs } from 'node:fs';

let currentDir = os.homedir();

export function printCurrentDirectory() {
  console.log(`You are currently in ${currentDir}`);
}

export function up() {
  const parentDir = resolve(currentDir, "..");

  if (parentDir === currentDir) {
    console.log("You are already at the root directory.");
    printCurrentDirectory();
    return;
  }
  
  currentDir = parentDir;
  printCurrentDirectory(); 
}

const typeOrder = { 'directory': 0, 'file': 1, '': 2 };

export async function ls() {
  try {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    const table = entries.map(entry => {
      const isFile = entry.isFile();
      const isDirectory = entry.isDirectory();

      return {
        Name: entry.name,
        Type: isFile && 'file' || isDirectory && 'directory' || '',
        Extension: isFile ? extname(entry.name) : ''
      };
    });    

    table.sort((a, b) => typeOrder[a.Type] - typeOrder[b.Type] || a.Name.localeCompare(b.Name));

    console.table(table);    
  } catch (err) {
    console.error('Error reading directory:', err.message);
  }

  printCurrentDirectory();
}