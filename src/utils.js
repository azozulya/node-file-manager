import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export const rl = createInterface({ input, output, prompt: '>> ' });

export async function getName() {
  const username = await rl.question('Enter your username: ');

  if (!username)
    throw new Error('Username is necessary');

  return username;
}


