'use strict';

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
      Authorization: `Bearer ${token.id_token}`
    }
  };
  
  let r = await axios(config);
  return r.data;
}

async function chooseSpot() {
  let spots = await getEmptySpots();
  console.log(spots);
  for (let i = 0; i < spots.length; i++) {
    console.log(`${i}: Price: ${spots[i].price}, hours: ${spots[i].maxHours}`);
  }
  let chosenSpotId = prompt('Which spot do you want:  ');
  let chosenSpot = spots[chosenSpotId];
  console.log(`Price: ${chosenSpot.price}, hours: ${chosenSpot.maxHours}`);
  return chosenSpot;

}

async function rentSpot(spot) {
  console.log(spot);
  let renter = spot.renterId;
  let b = spot.booked ? false : true;

  let newSpot = {
    booked: b,
    renterId: 1,
  };

  config = {
    method: 'put',
    baseURL: API,
    url: `/spot/${spot.id}`,
    data: JSON.stringify(newSpot),
    headers: {
      Authorization: `Bearer ${token.id_token}`
    }

  };

  let r = await axios(config);
  //SNS notify owner that this spot has been rented
  sendSNS(r.data);
  if (b) {
    console.log('Renting spot!');
  }
  else {
    console.log('Checking out!');
    sendInvoice(r.data, renter);
  }

  return r.data;
}

function sendInvoice(spot, renter) {
  //generate invoice based on hours * price per hour, prompt renter to pay
  let owed = spot.price * spot.maxHours;
  let invoice = (`You spent ${spot.maxHours} hours at this spot with a rate of $${spot.price} per hour, your credit card has been charged $${owed}`);
  console.log(invoice);

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
        console.log(`SNS message sent: ${data}`);
      })
      .catch((err) => {
        console.error(`Error sending SNS message: ${err}`);
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
        console.log(`SNS message sent: ${data}`);
      })
      .catch((err) => {
        console.error(`Error sending SNS message: ${err}`);
      });
  }
}

async function main() {
  let user = prompt('Enter email to login: ');
  let pass = prompt('Enter password: ');
  token = await login(user, pass);

  console.log(token);
  //renter chooses spot to rent
  let spot = await chooseSpot();
  let s = await rentSpot(spot);
  console.log(`Spot rented for ${s.maxHours} hours.`);

  //renter rents spot for the max hours available
  setTimeout(async () => {
    let x = await rentSpot(s);
    console.log(x);
  }, 2000 * s.maxHours);


  //rental complete, use rentSpot() to change the spot to booked=false in order to finish rental

}

main();
