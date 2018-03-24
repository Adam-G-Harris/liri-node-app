require("dotenv").config();

const keys = require('./keys');

const spotify = new Spotify(keys.spotify);

const twitter = new Twitter(keys.twitter);

console.log(twitter);
