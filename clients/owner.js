'use strict';

require('dotenv').config();
const chalk = require('chalk');
const { Consumer } = require('sqs-consumer'); 
const AWS = require('aws-sdk');
const prompt = require('prompt-sync')();
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
AWS.config.update({ region: 'us-west-2' });
const { login } = require('../auth/loginUser');

// ParkingSpots.fifo queue URL
const queueURL = process.env.SQS_URI;

const app = Consumer.create({
  region: 'us-west-2',
  queueUrl: queueURL,
  handleMessage: async (message) => {
    try{
      let data = JSON.parse(message.Body);
      console.log(chalk.yellow.italic(data.Message));
    }
    catch (e){
      console.log(chalk.bgRed(e));
    }
  },
});

async function main() {
  let loginprompt = false;
  while (!loginprompt) {
    let user = prompt('Enter owner email to login: ');
    let pass = prompt('Enter password: ');
  
    let token = await login(user, pass);
    if (token.statusCode === 403) {
      console.log('Invalid login credentials, please try again.');
    } else {
      console.log(chalk.cyan('Your notifications:'));
      loginprompt = true;
    }
  }
  
  app.start();
}

main();
