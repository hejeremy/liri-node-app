/* Homework assignment: liri-node-app
 *
 * Author: Jeremy He
 * Created: 7-24-2017
 * Last Edited: 7-26-2017
 */

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
    default:
        break;
}

function myTweets() {
    var Twitter = require('twitter');
    var twitterKeys = require('./keys.js').twitterKeys;

    var client = new Twitter(twitterKeys);

    var params = {screen_name: 'nodejs'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            return console.log(error);
        }

        console.log(tweets);
    });
}

function spotifyThisSong(songName) {
    if (songName === '') {
        songName = 'All the Small Things';
    }
    console.log(songName);
    var Spotify = require('node-spotify-api');
    var spotifyKeys = require('./keys.js').spotifyKeys;

    var spotify = new Spotify(spotifyKeys);

    spotify.search({
        type: 'track',
        query: songName,
    }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log(data.tracks.items[0]);
    });
}

function movieThis(movieName) {
    var request = require('request');
    if (movieName === '') {
        movieName = 'Mr. Nobody';
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
    request(queryUrl, function(err, r, b) {
        if (!err && r.statusCode === 200) {
            var obj = JSON.parse(b);
            console.log(obj);
        }
    });
}

function doWhatItSays(inputString) {
}
