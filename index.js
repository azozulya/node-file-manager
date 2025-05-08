import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { up, ls, printCurrentDirectory, cd } from './src/navigation.js';

const rl = createInterface({ input, output, prompt: '>> '});
let username;

async function getName() {
  const username = await rl.question('Enter your username: ');

  if (!username)
    throw new Error('Username is necessary');

  return username;    
}

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
  console.log('args: ', args);

  try {
    switch (command) {
      case 'up':
        up();
        break;
      case 'ls': {
        await ls();
        break;
      }
      case 'cd': {
        await cd(args && args[0]);
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
