// enable CLI prompts
const prompt = require('prompt-sync')();
const { ManagementClient } = require('auth0');

// from auth0, used to manage users
const management = new ManagementClient({
  domain: 'dev-clgtb4uqmlleu7uk.us.auth0.com',
  clientId: 'Q66Bi2Ilz8Nf2hpCaJhYnpwIKsos0DVm',
  clientSecret: 'oEjyQiG0haL1_r660iAiTFKIk3qv2xGk6q5rqfn-rz_ZFTM-S1TMxVbLtsp1r_T2',
  scope: 'read:users create:users read:roles update:users create:role_members',
});

async function createUser(email, username, password) {
  try {
    // create a new user
    const createdUser = await management.createUser({
      connection: 'Username-Password-Authentication',
      email: email,
      username: username,
      password: password,
      // user is not req'd to verify email
      email_verified: false,
    });

    // assign roles
    await management.assignRolestoUser(
      { id: createdUser.user_id },
      { roles: ['rol_fMzcYOYVZgf5Evw9'] },
    );

    // get user roles
    const userRoles = await management.getUserRoles({
      id: createdUser.user_id,
    });

    console.log('User created: ', createdUser.username, userRoles);

    // // add role to user metadata
    // await management.updateUserMetadata(createdUser.user_id, {
    //   roles: userRoles.map((role) => role.name),
    // });

    return { createdUser, userRoles };
  } catch (e) {
    console.error('Error creating user: ', e);
    throw e;
  }
}

// user is prompted to enter their email and create a password
let email = prompt('Enter your email: ');
let username = prompt('Create a username: ');
let password = prompt('Create a password: ');

// user is created and stored in auth0
createUser(email, username, password);

// module.exports = { createUser, management };