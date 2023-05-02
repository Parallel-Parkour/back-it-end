const prompt = require('prompt-sync')();
const { AuthenticationClient } = require('auth0');

const authenticate = new AuthenticationClient({
  domain: "dev-vp-2ecq3.us.auth0.com",
  clientId: "I4s2szsR9fem9usWK8BiwxqkqGQGVgTp",
  clientSecret: "0oOtdqR1UxR1MUT04TSXFtny8qhNzqNvIzwe4yOihtrzIqgq2re-Xkt3A8bJ_Fpx",
});

async function login(username, password) {
  try {
    const authResult = await authenticate.oauth.passwordGrant({
      username: username,
      password: password,
      scope: 'openid email profile',
    })

    console.log('Access Token:', authResult.access_token);
    console.log('ID Token:', authResult.id_token);
  } catch (e) {
    console.log(e);
  }
};


let user = prompt('Enter email to login: ');
let pass = prompt('Enter password: ');

login(user, pass);
