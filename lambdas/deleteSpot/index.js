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
  console.log(chalk.bgyellow('DELETE PERSON EVENT ', event));
  let params = event.pathParameters;
  let responseBody = null;
  // console.log('READING SPOT', spot);
  try {
    let deleted = await SpotModel.delete(params.id);
    console.log(chalk.cyan('Deleted ', deleted));
    responseBody = { message: 'Item successfully deleted.'};
  } catch (e) {
    console.log(chalk.bgred(e));
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(responseBody),
  };
  return response;
};