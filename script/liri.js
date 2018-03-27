const screenName = require('twitter-screen-name');
const Spotify = require('node-spotify-api');
const readline = require('readline');
const request = require('request');
const col = require('columnify');
const axios = require('axios');
const keys = require('./keys');
const fs = require('fs');

// Loads .env file variables into process.env
require("dotenv").config();

// Potential user inputs
const userArgs = {
    twitter: 'my-tweets',
    spotify: 'spotify-this-song',
    omdb: 'movie-this',
    do: 'do-what-it-says'
};

// User interaction interface
const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// First function that is executed
function init() {

    space();

    const userInputArg = process.argv.slice(2, 3);
    const userAdditionalArg = process.argv.slice(3);

    // Checks user argument value
    switch (userInputArg[0]) {

        case userArgs.twitter:
            getTwitter();
            break;
        case userArgs.spotify:
            getSpotify(userAdditionalArg);
            break;
        case userArgs.omdb:
            getOmdb(userAdditionalArg);
            break;
        case userArgs.do:
            getFileInfo();
            break;
        default:
            getInputError();
            break;
    }
}

// Application start call
init();

// Twitter call
async function getTwitter() {

    const twitterName = await getHandle();

    const url = `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${twitterName}&trim_user=true&count=20`;

    if (twitterName === null) {
        space();
        console.log(`> Sorry ${process.env['USERNAME']}... I couldn't find that Twitter name.`);
        space();
        return;
    }

    const options = {
        method: 'GET',
        url: url,
        qs: {
            "screen_name": twitterName
        },
        json: true,
        headers: {
            "Authorization": "Bearer " + process.env['TWITTER_BEARER_TOKEN']
        }
    };

    request(options, function (error, response, body) {

        for (let i = 0; i < body.length; i++) {

            if (i === 0) {
                separate();
            }
            console.log(body[i].created_at, ' - ', body[i].text);
            if (i === body.length - 1) {
                separate();
                console.log(`> These are ${twitterName}'s 20 most recent tweets.`);
                space();
            }
        }
    });
}

// Gets Twitter's screen name regardless of format
function getHandle() {

    let tempTwitterName;

    return new Promise(resolve => {

        read.question(`> Hey ${process.env['USERNAME']}, enter the name of any Twitter account > `, (answer) => {
            tempTwitterName = screenName(answer);
            resolve(tempTwitterName);
            read.close();
        });
    });
}

// Spotify call
function getSpotify(song) {

    if (song.length < 1) {
        song = ['The Sign, Ace of Base'];
    }

    const spotify = new Spotify({
        id: process.env['SPOTIFY_ID'],
        secret: process.env['SPOTIFY_SECRET']
    });

    spotify
        .search({
            type: 'track',
            query: song,
            limit: 1
        })
        .then(res => handleSpotify(res, song))
        .catch(err => console.log(err))
}

// Spotify handler & output
function handleSpotify(res, song) {

    const narrow = res.tracks.items[0];

    const narrowObj = {
        "Artist": narrow.album.artists[0].name,
        "Song": narrow.name,
        "Link": narrow.album.artists[0].external_urls.spotify,
        "Album": narrow.album.name
    };

    console.log(`> Hey ${process.env['USERNAME']}, you searched for - ${song}.`);
    separate();

    console.log(col(narrowObj, {
        truncate: true,
        showHeaders: false,
        columnSplitter: '  -  '
    }));

    separate();
    console.log("> This is Spotify's response to your input.");
    space();
    read.close();
}

// OMDB call
function getOmdb(movie) {

    let parsedBody, info;

    if (movie.length < 1) {
        movie = ['Mr. Nobody'];
    }

    const url = `http://www.omdbapi.com/?&type=movie&t=${movie}&apikey=${process.env['OMDB_KEY']}`;

    request(url, function (error, response, body) {
        parsedBody = JSON.parse(body);
        info = {
            "Title": parsedBody.Title,
            "Release Year": parsedBody.Year,
            "IMDB Rating": parsedBody.imdbRating,
            "Rotten Tomatoes": parsedBody.Ratings[1].Value,
            "Origin Country": parsedBody.Country,
            "Language": parsedBody.Language,
            "Plot": parsedBody.Plot,
            "Actors": parsedBody.Actors,
        };
        console.log(`> Hey ${process.env['USERNAME']}, you searched for - ${movie}.`);
        separate();
        console.log(col(info, {
            truncate: true,
            showHeaders: false,
            columnSplitter: '  -  '
        }));
        separate();
        console.log("> This is OMDB's response to your input.");
        space();
    });
    read.close();
}

// Grabs random file's contents
function getFileInfo() {

    fs.readFile('random.txt', 'utf8', (err, content) => {

        let fileCommand = content.split('"').splice(0, 1).toString().trim();
        let additionalCommand = content.split('"').splice(1, 1).toString().trim();

        // Checks user argument value
        switch (fileCommand) {

            case userArgs.twitter:
                getTwitter();
                break;
            case userArgs.spotify:
                getSpotify(additionalCommand);
                break;
            case userArgs.omdb:
                getOmdb(additionalCommand);
                break;
            case userArgs.do:
                getFileInfo();
                break;
            default:
                getInputError();
                break;
        }
    });
}

// Incorrect user input handler
function getInputError() {
    console.log(`> Hey ${process.env['USERNAME']}, make sure your input is one of the following: "${userArgs.twitter}", "${userArgs.spotify}", "${userArgs.omdb}", "${userArgs.do}".`);
    space();
    read.close();
}

// Console formatting
function separate() {
    console.log('-'.repeat(process.stdout.columns));
}

// Console formatting
function space() {
    console.log('');
}
