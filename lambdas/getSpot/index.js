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
  console.log(chalk.cyan('EVENT ', event.body));
  let params = event.pathParameters;
  let responseBody = null;
  // console.log('READING SPOT', spot);
  if (params) {
    responseBody = await SpotModel.scan('id').eq(params.id).exec();
  } else {
    responseBody = await SpotModel.scan().exec();
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(responseBody),
  };
  return response;
};