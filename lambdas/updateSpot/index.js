'use strict';

const chalk = require('chalk');
const dynamoose = require('dynamoose');

const SpotSchema = new dynamoose.Schema({
  id: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  maxHours: {
    type: Number,
    required: true,
  },
  booked: {
    type: Boolean,
    default: false,
  },
  ownerId: {
    type: Number,
    required: true,
  },
  renterId: Number,
});

const SpotModel = dynamoose.model('Spots', SpotSchema);

exports.handler = async(event) =>{
  console.log(chalk.yellow('UPDATE EVENT ', event.body));
  let params = event.pathParameters;
  let body = JSON.parse(event.body);
  let responseBody = null;
  let statusCode = null;

  try {
    responseBody = await SpotModel.update({'id': params.id}, body);
    statusCode = 200;
  } catch (e) {
    console.log(e);
    statusCode = 500;
  }

  const response = {
    statusCode: statusCode,
    body: JSON.stringify(responseBody),
  };
  return response;
};