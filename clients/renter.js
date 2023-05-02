'use strict';

const axios = require('axios');
require('dotenv').config();
const prompt = require('prompt-sync')();
const API = process.env.API_URL;

let config = {
  method: 'get',
  baseURL: API,
  url: '/spot',
};

async function getEmptySpots() {
  let r = await axios(config);
  return r.data;
}

async function chooseSpot(){
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

async function rentSpot(spot){
  console.log(spot);
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
  };

  let r = await axios(config);
  //SNS notify owner that this spot has been rented
  if(b){
    console.log('Renting spot!');
  }
  else{
    console.log('Checking out!');
    sendInvoice(r.data);
  }
  return r.data;
}

function sendInvoice(spot){
  //generate invoice based on hours * price per hour, prompt renter to pay
  let owed = spot.price*spot.maxHours;
  console.log(`You spent ${spot.maxHours} at this spot with a rate of ${spot.price} per hour, your credit card has been charged $${owed}`);

  //send the invoice to the owner somehow
}

async function main(){

  //renter chooses spot to rent
  let spot = await chooseSpot();
  let s = await rentSpot(spot);
  console.log(s);


  //renter rents spot for the max hours available
  setTimeout(() => {
    console.log(`Spot rented for ${s.maxHours} hours.`);
  }, 1000*s.maxHours);


  //rental complete, use rentSpot() to change the spot to booked=false in order to finish rental
  let x = await rentSpot(s);
  console.log(x);
}

main();
