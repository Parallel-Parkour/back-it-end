'use strict';

const dynamoose = require('dynamoose');
const create = require('../lambdas/createSpot');
const read = require('../lambdas/getSpot');
const update = require('../lambdas/updateSpot');
const destroy = require('../lambdas/deleteSpot');

jest.mock('dynamoose', () => {
  const modelInterface = {
    create: jest.fn(() => modelInterface),
    update: jest.fn(() => modelInterface),
    scan: jest.fn(() => modelInterface),
    query: jest.fn(() => modelInterface),
    eq: jest.fn(() => modelInterface),
    delete: jest.fn(() => modelInterface),
    exec: jest.fn(() => modelInterface),
  };
  return {
    Schema: jest.fn().mockImplementation(() => jest.fn()),
    model: jest.fn(() => modelInterface),
  };
});

describe('Testing functionality of lambda functions', () => {
  test('Testing Spot model CREATE', () => {
    let event = {
      body: JSON.stringify({}),
    };
    create.handler(event);
    expect(dynamoose.Schema).toHaveBeenCalled();
    expect(dynamoose.model).toHaveBeenCalled();
    expect(dynamoose.model().create).toHaveBeenCalledWith({});
  });

  test('Testing Spot model READ all spots', () => {
    let event = {
      body: JSON.stringify({}),
    };
    read.handler(event);
    expect(dynamoose.Schema).toHaveBeenCalled();
    expect(dynamoose.model).toHaveBeenCalled();
    expect(dynamoose.model().scan().exec).toHaveBeenCalledWith();
  });

  test('Testing Spot model READ one spot', () => {
    let event = {
      body: JSON.stringify({}),
      pathParameters: {id: '1'}, 
    };
    read.handler(event);
    expect(dynamoose.Schema).toHaveBeenCalled();
    expect(dynamoose.model).toHaveBeenCalled();
    expect(dynamoose.model().scan).toHaveBeenCalledWith('id');
    expect(dynamoose.model().scan().eq).toHaveBeenCalledWith(event.pathParameters.id);
  });

  test('Testing Spot model UPDATE spot', () => {
    let event = {
      body: JSON.stringify({}),
      pathParameters: {id: '1'}, 
    };
    update.handler(event);
    expect(dynamoose.Schema).toHaveBeenCalled();
    expect(dynamoose.model).toHaveBeenCalled();
    expect(dynamoose.model().update).toHaveBeenCalledWith({'id': event.pathParameters.id}, JSON.parse(event.body));
  });

  test('Testing Spot model DELETE spot', () => {
    let event = {
      body: JSON.stringify({}),
      pathParameters: {id: '1'}, 
    };
    destroy.handler(event);
    expect(dynamoose.Schema).toHaveBeenCalled();
    expect(dynamoose.model).toHaveBeenCalled();
    expect(dynamoose.model().delete).toHaveBeenCalledWith(event.pathParameters.id);
  });
});