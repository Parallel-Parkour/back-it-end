# Parallel Parkour Team

* Kirill Lesnykh
* Daniel Yoon
* Jonathan Tsai
* Kyle Freemantle
* Laurel Perkins

# Project: Back-It-End

Back-It-End is a RESTful API built with Node.js, Auth0, and AWS tools DynamoDB, SQS, SNS, API Gateway (with authorizer), and Lambdas

## Installation

1. Clone the repository: `git clone https://github.com/Parallel-Parkour/back-it-end.git`
2. Navigate to the project directory: `cd back-it-end`
3. Install dependencies: `npm install`

## Configuration

Back-It-End requires configuration before it can be run both locally and on your personal AWS account.  
This includes setting environment variables for the DynamoDB connection, JWT secret, and port number.  

- Go to your AWS account and create a database with DynamoDB, you will use the ARN from this in your CRUD lambda functions
- Go to API Gateway. Make a restful api with the following routes:  

```
/  
  /spot  
    GET  
    OPTIONS  
    POST  
    /{id}  
      DELETE  
      GET  
      PUT  
```
      
- You will need to go to Lambda now and create 5 functions and point the routes in API Gateway to use those functions for the CRUD requests, as well as a 5th function as an authorizer that checks the token and sees if the user is permitted to use that route. You will use this gateway ARN in your .env
- You will also need to create a FIFO SNS and a FIFO SQS where the SQS is subscribed to the SNS, you will use those in your .env
- If you have more people than 1 working on this project we suggest creating a IAM role. We made a Developer role and gave it permissions that allow all of the AWS apps we used, and you will need them to AWS configure with that developer role in order to be able to run Renter and Owner locally
      

Create a `.env` file in the root directory of the project and populate it with the following from your AWS applications etc.:

```
PORT=3001
AUTH0_DOMAIN=...
AUTH0_CLIENTID=...
AUTH0_CLIENT_SECRET=...
JWKS_URI=...
AUTH0_RENTER_ID=...
AUTH0_OWNER_ID=...
API_URL=...
SNS_ARN=...
```

## Usage

To start the renter, run `node clients/renter.js` and you should be able to log in, choose a parking spot to rent and after the alloted time you will be checked out and charged for your time. To start the owner, run `node clients/owner.js` and you should be able to log in and once logged in you will see previous notifications that your spot was rented, that the renter was checked out and you will recieve a copy of the invoice


## Contributing

Contributions to Back-It-End are welcome! If you find a bug or would like to suggest an improvement, please open an issue or submit a pull request.

## License

Back-It-End is licensed under the [MIT License](https://opensource.org/licenses/MIT).
