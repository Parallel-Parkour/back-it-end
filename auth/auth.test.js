'use strict';

const createUser = require('./createUser.js');
const chalk = require('chalk');

// prompts must be commented out on createUser.js before tests will run
describe('Testing the createUser function', () => {

  test('Can successfully create a new user', async() => {

    const logSpy = jest.spyOn(global.console, 'log');

    let username = 'babyKirk@gmail.com';
    let password = 'babyKirkIsBaby';

    await createUser(username, password);

    expect(logSpy).toHaveBeenCalledWith('User created: babyKirk');

    logSpy.mockRestore();
  });

  test('Can successfully assign roles to a new user', async() => {

    const logSpy = jest.spyOn(global.console, 'log');

    let username = 'superBabyKirk@gmail.com';
    let password = 'babyKirkIsVerySuperBaby';

    await createUser(username, password);

    expect(logSpy).toHaveBeenCalledWith('Roles and permissions assigned successfully.');

    logSpy.mockRestore();
  });
});