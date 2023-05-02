// enable CLI prompts
const prompt = require('prompt-sync')();
const { ManagementClient } = require('auth0');

// from auth0, used to manage users
const management = new ManagementClient({

  domain: 'dev-clgtb4uqmlleu7uk.us.auth0.com',
  clientId: 'Q66Bi2Ilz8Nf2hpCaJhYnpwIKsos0DVm',
  clientSecret: 'oEjyQiG0haL1_r660iAiTFKIk3qv2xGk6q5rqfn-rz_ZFTM-S1TMxVbLtsp1r_T2',
  // grant_types: 'password',
  scope: 'read:users create:users',
});


async function createUser(email, password) {
  try {
    const user = await management.createUser({
      connection: 'Username-Password-Authentication',
      email: email,
      password: password,
      // user is not req'd to verify email
      email_verified: false,
    });
    console.log('User created:', user.email);
  } catch (e) {
    console.error('Error creating user:', e);
  }
}


// user is prompeted to enter their email and create a password
let username = prompt('Enter email as login: ');
let password = prompt('Create a password: ');
// user is created and stored in auth0
createUser(username, password);

