'use strict';

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

  const spot = JSON.parse(event.body);

  const response = {
    statusCode: null,
    body: null,
  };
  
  
  if (spot) {
    const newSpot = await SpotModel.create(spot);
    response.body = JSON.stringify(newSpot);
    response.statusCode = 200;
  } else {
    
    response.body = JSON.stringify('Missing request body');
    response.statusCode = 500;
  }
  
  return response;
};