'use strict';

// enable CLI prompts
const prompt = require('prompt-sync')();
const { login } = require('./loginUser');

async function runLoginPrompt() {
  let username = prompt('Enter email to login: ');
  let password = prompt('Enter password: ');

  const authResult = await login(username, password);
  console.log('Access Token:', authResult.access_token);
  console.log('ID Token:', authResult.id_token);
}

runLoginPrompt(); 