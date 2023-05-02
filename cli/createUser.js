const prompt = require('prompt-sync')();
const { ManagementClient } = require('auth0');


const management = new ManagementClient({

  domain: "dev-vp-2ecq3.us.auth0.com",
  clientId: "I4s2szsR9fem9usWK8BiwxqkqGQGVgTp",
  clientSecret: "0oOtdqR1UxR1MUT04TSXFtny8qhNzqNvIzwe4yOihtrzIqgq2re-Xkt3A8bJ_Fpx",
  grant_types: "password",
  scope: "read:users create:users",
});


async function createUser(email, password) {
  try {
    const user = await management.createUser({
      connection: 'Username-Password-Authentication',
      email: email,
      password: password,
      email_verified: false,
    });
    console.log('User created:', user.email);
  } catch (e) {
    console.error('Error creating user:', e);
  }
}



let username = prompt("Enter email as login: ");
let password = prompt("Create a password: ");
createUser(username, password);

