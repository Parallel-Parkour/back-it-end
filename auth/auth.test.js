'use strict';
const { createUser } = require('./createUser');

describe('Testing the createUser function', () => {
  test('Can successfully create a new user and assign roles', () => {
    let username = 'babyKirk';
    let password = 'babyKirkIsBaby';
    createUser(username, password);
    expect(console.log()).toEqual('User created: babyKirk');
  });
});