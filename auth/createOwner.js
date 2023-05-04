'use strict';

// enable CLI prompts
const prompt = require('prompt-sync')();
const { ManagementClient } = require('auth0');
require('dotenv').config({ path: '../.env' });

// from auth0, used to manage users
const management = new ManagementClient({
  domain: `${process.env.AUTH0_DOMAIN}`,
  clientId: `${process.env.AUTH0_CLIENTID}`,
  clientSecret: `${process.env.AUTH0_CLIENT_SECRET}`,
  scope: 'read:users create:users',
});


async function createUser(username, password) {
  try {
    const user = await management.createUser({
      connection: 'Username-Password-Authentication',
      email: username,
      password: password,
      email_verified: false,
    });
    console.log('User created:', user.email);
    console.log('User id: ', user.user_id);

    management.assignRolestoUser({ id: user.user_id }, { roles: [process.env.AUTH0_OWNER_ID] }, function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(chalk.cyan('Roles and permissions assigned successfully'));
    });
  } catch (e) {
    console.error('Error creating user:', e);
  }
}

// user is prompeted to enter their email and create a password
let username = prompt('Enter username as login: ');
let password = prompt('Create a password: ');
// user is created and stored in auth0

createUser(username, password);

