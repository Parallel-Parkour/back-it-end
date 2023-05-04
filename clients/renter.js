'use strict';

const chalk = require('chalk');
const axios = require('axios');
require('dotenv').config({ path: '../.env' });
// CLI prompts
const prompt = require('prompt-sync')();
const API = process.env.API_URL;
const AWS = require('aws-sdk');

const { login } = require('../auth/loginUser');

// make a new instance of the SNS service with correct region/API version
const sns = new AWS.SNS({ apiVersion: '2010-03-31', region: 'us-west-2' });

// set the topic ARN from our AWS instance
const topicArn = 'arn:aws:sns:us-west-2:584607906861:ParkingSpots.fifo';

let token;

async function getEmptySpots() {
  let config = {
    method: 'get',
    baseURL: API,
    url: '/spot',
    headers: {
      Authorization: `Bearer ${token.id_token}`,
    },
  };
  
  let r = await axios(config);
  return r.data;
}

async function chooseSpot() {
  let spots = await getEmptySpots();
  console.log(chalk.cyan('All Available Spots'));
  for (let i = 0; i < spots.length; i++) {
    console.log(chalk.blue.bold(`${i}: Price: $${spots[i].price}.00/hr, Parking Time: ${spots[i].maxHours}hr`));
  }

  //ensure that user is picking a valid spot.
  let spotPicked = false;
  let chosenSpotId = null;
  while (!spotPicked) {
    chosenSpotId = prompt(chalk.green.bold('Which spot do you want: '));
    let idAsInt = parseInt(chosenSpotId);
    if (!isNaN(idAsInt) && idAsInt < spots.length && idAsInt > -1) {
      spotPicked = true;
    } else {
      console.log('Please pick a valid parking spot.');
    }
  }

  let chosenSpot = spots[chosenSpotId];
  console.log(chalk.blue.bold(`Spot ID ${chosenSpot.id} chosen - Price: ${chosenSpot.price}, hours: ${chosenSpot.maxHours}`));
  return chosenSpot;
}

async function rentSpot(spot) {
  console.log(chalk.yellow.italic(spot));
  let renter = spot.renterId;
  let b = spot.booked ? false : true;

  let newSpot = {
    booked: b,
    renterId: 1,
  };

  let config = {
    method: 'put',
    baseURL: API,
    url: `/spot/${spot.id}`,
    data: JSON.stringify(newSpot),
    headers: {
      Authorization: `Bearer ${token.id_token}`,
    },

  };

  let r = await axios(config);
  //SNS notify owner that this spot has been rented
  sendSNS(r.data);
  if (b) {
    console.log(chalk.magenta(`You are now parked!`));
  }
  else {
    console.log(chalk.magenta('Checking out!'));
    sendInvoice(r.data, renter);
  }

  return r.data;
}

function sendInvoice(spot, renter) {
  //generate invoice based on hours * price per hour, prompt renter to pay
  let owed = spot.price * spot.maxHours;
  let invoice = (`You spent ${spot.maxHours} hours at this spot with a rate of $${spot.price}.00/hr. Your credit card has been charged $${owed}.00`);
  console.log(chalk.blue.bold(invoice));

  //send the invoice to the owner somehow
  sendSNS(spot, `Copy of invoice: ${invoice}`);
}

async function sendSNS(spot, invoice) {
  if (invoice) {
    await sns
      .publish({
        Message: invoice,
        TopicArn: topicArn,
        MessageGroupId: '1',
      })
      .promise()
      .then((data) => {
        console.log(chalk.cyan('Owner was sent a copy of the invoice.'));
      })
      .catch((err) => {
        console.error(chalk.bgRed(`Error sending message to Owner: ${err}`));
      });
  }
  else {
    let message = spot.booked
      ? `Spot with ID ${spot.id} has been rented.`
      : `Renter has checked out from spot with ID ${spot.id}.`;

    await sns
      .publish({
        Message: message,
        TopicArn: topicArn,
        MessageGroupId: '1',
      })
      .promise()
      .then((data) => {
        console.log(chalk.cyan('Owner was sent message:', message));
      })
      .catch((err) => {
        console.error(chalk.bgRed(`Error sending message to Owner: ${err}`));
      });
  }
}

//Initialize renter CLI and run prompts.
async function main() {
  //Continue prompting for login until valid credentials are supplied.
  let loginprompt = false;
  while (!loginprompt) {
    let user = prompt(chalk.green.bold('Enter email to login: '));
    let pass = prompt(chalk.green.bold('Enter password: '));
    token = await login(user, pass);
    if (token.statusCode === 403) {
      console.log('Invalid login credentials, please try again.');
    } else {
      loginprompt = true;
    }
  }

  //renter chooses spot to rent
  let spot = await chooseSpot();
  let s = await rentSpot(spot);

  console.log(chalk.cyan(`Spot rented for ${s.maxHours} hours.`));


  //renter rents spot for the max hours available
  setTimeout(async () => {
    let x = await rentSpot(s);
    console.log(chalk.yellow.italic('Thank you for using Back-It-End!'));
  }, 2000 * s.maxHours);
}

main();
