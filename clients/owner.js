'use strict';

const chalk = require('chalk');
const { Consumer } = require('sqs-consumer'); 
const AWS = require('aws-sdk');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
AWS.config.update({ region: 'us-west-2' });
const { login, prompt } = require('../auth/loginUser');

// ParkingSpots.fifo queue URL
const queueURL = 'https://sqs.us-west-2.amazonaws.com/584607906861/ParkingSpots.fifo';

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
  let user = prompt('Enter owner email to login: ');
  let pass = prompt('Enter password: ');
  
  let token = await login(user, pass);
  console.log(chalk.cyan('Retrieving all notifications:'));
  
  app.start();
}

main();
