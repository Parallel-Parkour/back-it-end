// enable CLI prompts
const prompt = require('prompt-sync')();
const { AuthenticationClient } = require('auth0');

// from auth0, authenticates users
const authenticate = new AuthenticationClient({
  domain: 'dev-clgtb4uqmlleu7uk.us.auth0.com',
  clientId: 'Q66Bi2Ilz8Nf2hpCaJhYnpwIKsos0DVm',
  clientSecret: 'oEjyQiG0haL1_r660iAiTFKIk3qv2xGk6q5rqfn-rz_ZFTM-S1TMxVbLtsp1r_T2',
  audience: 'https://dev-clgtb4uqmlleu7uk.us.auth0.com/api/v2/',
  connection:'Username-Password-Authentication',
});

async function login(username, password) {
  try {
    // authenticate user
    const authResult = await authenticate.oauth.passwordGrant({
      username: username,
      password: password,
      scope: 'openid profile email',
    });

    console.log('Access Token:', authResult.access_token);
  } catch (e) {
    console.log(e);
  }
}

let user = prompt('Enter email to login: ');
let pass = prompt('Enter password: ');

// login(user, pass);
console.log('Login successful: ', user);

module.exports = { login, user, pass };