import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { up, ls, printCurrentDirectory } from './src/navigation.js';

const rl = createInterface({ input, output, prompt: '>>'});
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
  console.log(`Received: ${line}`);
  switch (line) {
    case 'up':
      up();
      break;
    case 'ls': {
      rl.pause();
      await ls();
      rl.prompt();
      break;
    }
    default:
      console.log('default');
      break;
  }
  
   
  if (line === '.exit') {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    process.exit();
  }
});


process.on('SIGINT', () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit();
});

main();
