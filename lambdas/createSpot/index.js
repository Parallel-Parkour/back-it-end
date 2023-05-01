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
  let spot = JSON.parse(event.body);
  // console.log('READING SPOT', spot);
  let returnSpot;
  
  try{
    returnSpot = await SpotModel.create(spot);
  }
  catch(e){
    console.error('ERROR: ', e);
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(`HELLO FROM NEW SPOT, ${returnSpot}`),
  };
  return response;
};