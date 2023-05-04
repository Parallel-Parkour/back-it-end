'use strict';

const { login, prompt } = require('./loginUser');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const util = require('util');


const jwks = jwksClient({
  jwksUri: process.env.JWKS_URI,
});

require('dotenv').config({ path: '../.env' });


async function getInfo() {
  let user = prompt('Enter email to login: ');
  let pass = prompt('Enter password: ');

  const info = await login(user, pass);

  try {
    const decodedToken = await jwt.decode(info.id_token, { complete: true });
    const { header } = decodedToken;
    console.log(decodedToken);

    // Get the public key for the token's signature
    const key = await jwks.getSigningKey(header.kid);
    const publicKey = key.publicKey || key.rsaPublicKey;

    // Verify the token's signature
    await jwt.verify(info.id_token, publicKey, { algorithms: ['RS256'] });

    // Return true if the signature is valid
    return true;
  } catch (error) {
    console.error('Error verifying JWT:', error.message);
    return false;
  }
}

getInfo();
