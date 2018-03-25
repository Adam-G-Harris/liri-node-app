// This file has served its purpose.
// Obtained Twitter bearer token.

require("dotenv").config();

let bearer = null;

const request = require('request');
const consumer_key = process.env['TWITTER_CONSUMER_KEY'];
const consumer_secret = process.env['TWITTER_CONSUMER_SECRET'];
const encode_secret = new Buffer(consumer_key + ':' + consumer_secret).toString('base64');

const options = {
    url: 'https://api.twitter.com/oauth2/token',
    headers: {
        'Authorization': 'Basic ' + encode_secret,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: 'grant_type=client_credentials'
};

request.post(options, function (error, response, body) {
    // No need to call more than once.
    // Already obtained the bearer token, it is valid for the life of the application.
});
