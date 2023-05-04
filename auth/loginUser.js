'use strict';

// enable CLI prompts
const prompt = require('prompt-sync')();
const chalk = require('chalk');

const { AuthenticationClient } = require('auth0');
require('dotenv').config();

// from auth0, authenticates users
// does auth0 need Auth0 Authenticate API?

const authenticate = new AuthenticationClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENTID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  connection:'Username-Password-Authentication',
});

async function login(username, password) {
  try {
    const authResult = await authenticate.oauth.passwordGrant({
      username: username,
      password: password,
    });
    
    return authResult;
  } catch (e) {
    return e;
  }
}

module.exports = {
  login,
  prompt,
};
