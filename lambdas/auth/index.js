'use strict';

require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const jwks = jwksClient({
  jwksUri: process.env.JWKS_URI,
});

exports.handler = async(event) => {
  console.log(event);
  //event contains the token under event.authorizationToken?
  let token = event.authorizationToken.split(' ')[1];
  console.log('token', token);
  let policy = {
    principalId: '',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: 'Deny',
        Resource: event['methodArn'],
      }],
    },
  };
  try {
    const decodedToken = await jwt.decode(token, { complete: true });
    const { header } = decodedToken;

    // Get the public key for the token's signature
    const key = await jwks.getSigningKey(header.kid);
    const publicKey = key.publicKey || key.rsaPublicKey;

    // Verify the token's signature
    let goodUser = await jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    console.log(goodUser);
    if(goodUser.role[0]==='renter' || goodUser.role[0]==='owner'){
      let GET = event['methodArn'].includes('/GET/');
      let PUT = event['methodArn'].includes('/PUT/');
      if (GET || PUT) {
        policy.policyDocument.Statement[0].Effect = 'Allow';
      }
      policy.principalId = goodUser.email;
    }
    return policy;
    // Return true if the signature is valid
  } catch (error) {
    console.error('Error verifying JWT:', error.message);
    return false;
  }
};