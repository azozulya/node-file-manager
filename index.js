import { up, ls, printCurrentDirectory, cd } from './src/navigation.js';
import { add, cat, copy, mkdir, moveFile, removeFile, rename } from './src/files.js';
import { getName, printErrorMessage, rl } from './src/utils.js';

let username;

async function main() {
  const args = process.argv.slice(2);
  const usernameArg = args.find(arg => arg.startsWith('--username='));

  username = usernameArg ? usernameArg.split('=')[1] : await getName();  
  
  console.log(`Welcome to the File Manager, ${username}!`);
  printCurrentDirectory();
}

rl.on('line', async (line) => {
  if (line === '.exit') {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    process.exit();
  }

  rl.pause();

  const [command, ...args] = line.trim().split(' ');

  try {
    switch (command) {
      case 'up':
        up();
        break;
      case 'ls':
        await ls();
        break;
      case 'cd':
        await cd(args && args[0]);
        break;
      case 'cat':
        await cat(args && args[0]);
        break;
      case 'add':
        await add(args && args[0]);
        break;
      case 'mkdir':
        await mkdir(args && args[0]);
        break;
      case 'rn': {
        if (!args || args.length < 2)
          return printErrorMessage();

        const [oldName, newName] = args;
        rename(oldName, newName);
        break;
      }        
      case 'cp':{
        if (!args || args.length < 2)
          return printErrorMessage();

        const [filePath, destDir] = args;
        copy(filePath, destDir);
        break;
      }
      case 'mv': {
        if (!args || args.length < 2)
          return printErrorMessage();

        const [filePath, destDir] = args;
        moveFile(filePath, destDir);
        break;
      }
      case 'rm': {
        if (!args)
          return printErrorMessage('Add path to file to remove it');

          const [filePath] = args;
          removeFile(filePath);
          break;
        }
      default:
        console.log('No such command. Try another');
        break;
    }
    rl.prompt();
  } catch (err) {
    console.error('Command error:', err.message);
  }
});

process.on('SIGINT', () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit();
});

try {
  await main();
} catch (err) {
  console.error('ERROR:', err.message);
}
