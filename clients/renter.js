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

let results = async () => {
  let r = await axios(config);
  return r.data;
};

results()
  .then(r => console.log(r));

//let chosenSpot = prompt('Which spot do you want (by id):  ');
