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
  let newSpot = {
    booked: true,
    renterId: 1,
  };

  config = {
    method: 'put',
    baseURL: API,
    url: `/spot/${spot.id}`,
    data: JSON.stringify(newSpot),
  };

  let r = await axios(config);
  //SNS notify
  return r.data;
}

async function main(){
  let spot = await chooseSpot();
  let s = await rentSpot(spot);
  console.log(s);
}

main();
