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
    case 'do-what-it-says':
        doWhatItSays(process.argv.slice(3).join(' '));
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
        songName = 'The Sign';
    }
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

        var songInfo = data.tracks.items[0];

        var artists = songInfo.album.artists;
        var artistsList = [];
        for (var i=0; i<artists.length; i++) {
            artistsList.push(artists[i].name);
        }

        console.log(
                'Artist(s): ' + artistsList.join(', ') + '\n'
                + 'Song: ' + songInfo.name + '\n'
                + 'Preview: ' + songInfo.preview_url + '\n'
                + 'Album: ' + songInfo.album.name
                );
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
            //console.log(obj);

            console.log(
                    'Title: ' + obj.Title + '\n'
                    + 'Year: ' + obj.Year + '\n'
                    + 'IMDB: ' + findRating(obj.Ratings, 'Internet Movie Database') + '\n'
                    + 'Rotten Tomatoes: ' + findRating(obj.Ratings, 'Rotten Tomatoes') + '\n'
                    + 'Country: ' + obj.Country + '\n'
                    + 'Language: ' + obj.Language + '\n'
                    + 'Plot: ' + obj.Plot + '\n'
                    + 'Actors: ' + obj.Actors
                    );
        }
    });
}

function findRating(inputArray, source) {
    for (var i=0; i<inputArray.length; i++) {
        if (inputArray[i].Source == source) {
            return inputArray[i].Value;
        }
    }
    return null;
}

function doWhatItSays(inputFile) {
    if (inputFile === '') {
        inputFile = 'random.txt';
    }
    var fs = require('fs');

    fs.readFile(inputFile, 'utf8', function(err,data) {
        if (err) {
            console.log(err);
        }

        var command = data.split(',');
        handle(command);
    });
}

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
