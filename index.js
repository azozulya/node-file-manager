import * as readline from 'node:readline/promises';
import { cwd, stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

let username;

function printCurrentDirectory() {
  console.log(`You are currently in ${cwd()}`);
}

async function getName() {
  username = await rl.question('Enter your username: ');

  if (username){
    console.log(`Welcome to the File Manager, ${username}!`);
    printCurrentDirectory();
  } else
    throw new Error('Username is necessary')
}

async function main() {
  const args = process.argv.slice(2);
  const usernameArg = args.find(arg => arg.startsWith('--username='));

  if (usernameArg) {
    username = usernameArg.split('=')[1];
    console.log(`Welcome to the File Manager, ${username}!`);
    printCurrentDirectory();
    return;
  } 
  
  await getName();
}

rl.on('line', (input) => {
  if (input === '.exit') {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    process.exit();
  }

  printCurrentDirectory(); 
});


process.on('SIGINT', () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit();
});

main();
