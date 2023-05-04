'use strict';

const { createUser } = require('./createUser');
const chalk = require('chalk');

describe('Testing the createUser function', () => {
  test('Can successfully create a new user', () => {
    let username = 'babyKirk';
    let password = 'babyKirkIsBaby';
    createUser(username, password);
    expect(console.log()).toEqual(chalk.magenta('User created: babyKirk'));
    // why is it giving me prompts tho?
  });
});