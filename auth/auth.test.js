'use strict';

const { createUser } = require('./createUser');
const chalk = require('chalk');

describe('Testing the createUser function', () => {

  test('Can successfully create a new user', () => {

    const logSpy = jest.spyOn(global.console, 'log').mockImplementation();

    let username = 'babyKirk';
    let password = 'babyKirkIsBaby';

    createUser(username, password);

    expect(logSpy).toHaveBeenCalledWith('User created: babyKirk');

    logSpy.mockRestore();
  });

  test('Can successfully assign roles to a new user', () => {

    const logSpy = jest.spyOn(global.console, 'log').mockImplementation();

    let username = 'superBabyKirk';
    let password = 'babyKirkIsVerySuperBaby';

    createUser(username, password);

    expect(logSpy).toHaveBeenCalledWith('Roles and permissions assigned successfully.');

    logSpy.mockRestore();
  });
});