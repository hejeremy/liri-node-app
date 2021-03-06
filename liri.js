/* Homework assignment: liri-node-app
 *
 * Author: Jeremy He
 * Created: 7-24-2017
 * Last Edited: 7-26-2017
 */

//Grabs keys from keys.js
const keys = require('./keys.js');

switch(process.argv[2]) {
    case 'my-tweets':
        myTweets();
        break;
    case 'spotify-this-song':
        spotifyThisSong(process.argv.slice(3).join(' '));
        break;
    case 'movie-this':
        movieThis(process.argv.slice(3).join(' '));
        break;
    case 'do-what-it-says':
        doWhatItSays(process.argv.slice(3).join(' '));
        break;
    default:
        break;
}

//Function for returning my tweets
function myTweets() {
    const Twitter = require('twitter');
    const twitterKeys = keys.twitterKeys;

    const client = new Twitter(twitterKeys);

    const params = {user_id: '890249949929144320'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            return console.log(error);
        }

        const output = sortTweets(tweets);
        console.log(output);
        appendToFile(output);
    });
}

//Parses tweets into something that looks nicer
function sortTweets(inputArray) {
    let tweets = '';
    for (let i=0; i<Math.min(inputArray.length, 20); i++) {
        tweets += inputArray[i].text + '\n' + inputArray[i].created_at + '\n';
    }
    return tweets;
}

//Returns spotify information for song searched
function spotifyThisSong(songName) {
    if (songName === '') {
        songName = 'The Sign, Ace of Base';
    }
    const Spotify = require('node-spotify-api');
    const spotifyKeys = keys.spotifyKeys;

    const spotify = new Spotify(spotifyKeys);

    spotify.search({
        type: 'track',
        query: songName,
    }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        const songInfo = data.tracks.items[0];

        const artists = songInfo.album.artists;
        let artistsList = [];
        for (let i=0; i<artists.length; i++) {
            artistsList.push(artists[i].name);
        }

        const output = 'Artist(s): ' + artistsList.join(', ') + '\n'
                                     + 'Song: ' + songInfo.name + '\n'
                                     + 'Preview: ' + songInfo.preview_url + '\n'
                                     + 'Album: ' + songInfo.album.name + '\n';
        console.log(output);
        appendToFile(output);
    });
}

//Returns movie information for movie searched
function movieThis(movieName) {
    const request = require('request');
    if (movieName === '') {
        movieName = 'Mr. Nobody';
    }
    const queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
    request(queryUrl, function(err, r, b) {
        if (!err && r.statusCode === 200) {
            const obj = JSON.parse(b);
            //console.log(obj);

            const output = 'Title: ' + obj.Title + '\n'
                + 'Year: ' + obj.Year + '\n'
                + 'IMDB: ' + findRating(obj.Ratings, 'Internet Movie Database') + '\n'
                + 'Rotten Tomatoes: ' + findRating(obj.Ratings, 'Rotten Tomatoes') + '\n'
                + 'Country: ' + obj.Country + '\n'
                + 'Language: ' + obj.Language + '\n'
                + 'Plot: ' + obj.Plot + '\n'
                + 'Actors: ' + obj.Actors + '\n';
            console.log(output);
            appendToFile(output);
        }
    });
}

//Finds the rating from the source (i.e. IMDB, Rotten Tomates, Metacritic, etc)
function findRating(inputArray, source) {
    for (let i=0; i<inputArray.length; i++) {
        if (inputArray[i].Source == source) {
            return inputArray[i].Value;
        }
    }
    return null;
}

//Function to do what a .txt file says, defaults to random.txt if none entered
function doWhatItSays(inputFile) {
    if (inputFile === '') {
        inputFile = 'random.txt';
    }
    const fs = require('fs');

    fs.readFile(inputFile, 'utf8', function(err,data) {
        if (err) {
            console.log(err);
        }

        const command = data.split(',');
        handle(command);
    });
}

//Handles the parameters from the .txt file
function handle(inputArray) {
    switch(inputArray[0]) {
        case 'my-tweets':
            myTweets();
            break;
        case 'spotify-this-song':
            spotifyThisSong(inputArray.slice(1).join(' '));
            break;
        case 'movie-this':
            movieThis(inputArray.slice(1).join(' '));
            break;
        default:
            break;
    }
}

//Logs everything and appends it to 'log.txt'
function appendToFile(value) {
    const fs = require('fs');
    fs.appendFile('log.txt', '\n##########----------@@@@@@@@@@----------##########\n'
            + process.argv.join(' ') + '\n'
            + value + '\n', function(err) {
        if (err) throw err;
    });
}
