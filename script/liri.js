require("dotenv").config();

const args = require('minimist')(process.argv.slice(2));

const keys = require('./keys');

const spotify = keys.spotify;
const twitter = keys.twitter;

const userArgs = {
    twitter: 'my-tweets',
    spotify: 'spotify-this-song',
    omdb: 'movie-this',
    do: 'do-what-it-says'
};
