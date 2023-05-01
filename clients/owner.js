'use strict';

const AWS = require('aws-sdk');

// initialize SQS service with correct region (us-west-2)
const sqs = new AWS.SQS({ apiVersion: '2012-11-05', region: 'us-west-2' });

// ParkingSpots.fifo queue URL
const queueURL = 'https://sqs.us-west-2.amazonaws.com/584607906861/ParkingSpots.fifo';

// Function for receiving messages from the SQS queue
const receiveMessages = async () => {
  // set up message params
  const params = {
    QueueURL: queueURL,
    MaxNumberOfMessages: 1,
  };

  try {
    // call the receiveMessage method on SQS instance to fetch messages from the queue
    const data = await sqs.receiveMessage(params).promise();
    // if there's any message in the response, process them
    if (data.Messages) {
      // extract the first message from the response
      const message = data.Messages[0];
      // log the message body to the console for proof of life
      console.log('Message received: ', message.Body);

      // Delete the message from the queue to prevent duplicate processing
      await deleteMessage(message.ReceiptHandle);
    } else {
      // if there's no messages in the response, log it
      console.log('No messages in the queue.');
    }
  } catch (err) {
    // log errors that occur while receiving messages
    console.error('Error receiving messages: ', err);
  }
};

// deleteMessage function for deleting a message from the SQS queue after it's been processed
const deleteMessage = async (receiptHandle) => {
  // set up params for delete message
  const params = {
    QueueURL: queueURL,
    ReceiptHandle: receiptHandle,
  };

  try {
    // call the deleteMessage methjod on the SQS instance to remove the message from the queue
    await sqs.deleteMessage(params).promise();
    // log a message confirming the message was deleted
    console.log('Message deleted: ', receiptHandle);

  } catch (err) {
    // log any errors that occur while deleting the message
    console.error('Error deleting message: ', err);
  }
};

// call the receiveMessages function
receiveMessages();
