'use strict';

const { login } = require('./loginUser');

describe('Testing login function', () => {
  test('Successful login', async () => {
    let user = 'modopo@gmail.com';
    let pass = 'qwer1234!@#$';

    let result = await login(user, pass);
    expect(result.token_type).toEqual('Bearer')
  })

  test('Uncessful login', async () => {
    let user = 'modopo@gmail.com';
    let pass = 'notapassword';

    let result = await login(user, pass);
    expect(result.name).toEqual('invalid_grant');
  })
})