'use strict';

const chalk = require('chalk');
const { Consumer } = require('sqs-consumer'); 
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

// ParkingSpots.fifo queue URL
const queueURL = 'https://sqs.us-west-2.amazonaws.com/584607906861/ParkingSpots.fifo';

const app = Consumer.create({
  region: 'us-west-2',
  queueUrl: queueURL,
  handleMessage: async (message) => {
    try{
      let data = JSON.parse(message.Body);
      console.log(chalk.yellow.italic(data));
    }
    catch (e){
      console.log(chalk.bgred(e));
    }
  },
});

app.start();
