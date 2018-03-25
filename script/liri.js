const screenName = require('twitter-screen-name');
const readline = require('readline');
const request = require('request');
const axios = require('axios');
const keys = require('./keys');

// Loads .env file variables into process.env
require("dotenv").config();

// Potential user inputs
const userArgs = {
    twitter: 'my-tweets',
    spotify: 'spotify-this-song',
    omdb: 'movie-this',
    do: 'do-what-it-says'
};

// First function that is executed
function init() {

    let staticArgs = process.argv.slice(0, 2);
    let userInputArg = process.argv.slice(2, 3);
    let additionalArgs = process.argv.slice(3);

    let spotify = keys.spotify;
    let twitter = keys.twitter;

    // Checks user argument value
    switch (userInputArg[0]) {

        case userArgs.twitter:
            getTwitter();
            break;
        case userArgs.spotify:
            getSpotify();
            break;
        case userArgs.omdb:
            getOmdb();
            break;
        case userArgs.do:
            getRandomInfo();
            break;
        default:
            console.log(`Hey ${process.env['USERNAME']}, make sure your input is one of the following: "${userArgs.twitter}", "${userArgs.spotify}", "${userArgs.omdb}", "${userArgs.do}".`);
            break;
    }
}

async function getTwitter() {

    let twitterName = await getHandle();

    let url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${twitterName}&count=20`;

    if (twitterName === null) {
        console.log("Sorry that Twitter name couldn't be found...");
        return;
    }

    axios.get(url)
        .then(function (res) {
            console.log(res.data)
        })
        .catch(function (err) {
            console.log(err.message)
        });
}

function getHandle() {

    let tempTwitterName;

    let read = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        read.question(`Hey ${process.env['USERNAME']}, enter the name of any Twitter account ==> `, (answer) => {
            readline.moveCursor(read.output, 10, 1);
            tempTwitterName = screenName(answer);
            resolve(tempTwitterName);
            read.close();
        });
    });
}

function getSpotify() {

}

function getOmdb() {

}

function getRandomInfo() {

}

// Application start call
init();
