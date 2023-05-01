'use strict';

const dynamoose = require('dynamoose');

const SpotSchema = new dynamoose.Schema({
  id: String,
  price: Number, 
  maxHours: Number, 
  booked: Boolean,
  ownerId: {
    'type': Number,
    'default': null,
  },
  renterId: {
    'type': Number,
    'default': null,
  },
});

const SpotModel = dynamoose.model('Spots', SpotSchema);

exports.handler = async(event) =>{
  console.log('EVENT ', event.body);
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