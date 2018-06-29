require("dotenv").config();

var inquirer = require('inquirer');
var keys = require('./keys.js');
console.log(keys);

// variable holding keys to twitter
var Twitter = require('twitter');


// variable holding keys to spotify
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


var client = new Twitter(keys.twitter);


// OMDB API - request call.
var request = require("request");
var fs = require("fs");


// Spotify
var song = function () {

    inquirer
        .prompt([
            {
                type: "input",
                message: "What is a song you'd like to look up?",
                name: "song"
            }
        ]).then(function (inquirerResponse) {
            //grab user input
            var input = inquirerResponse.song;

            //make API call, return specific info 
            spotify.search({ type: 'track', query: input }).then(function (response) {
                console.log("Artist name: " + response.tracks.items[0].artists[0].name);
                console.log("The song name: " + response.tracks.items[0].name);
                console.log("Album name: " + response.tracks.items[0].album.name);
                console.log("External URL: " + response.tracks.items[0].album.artists[0].external_urls.spotify);
                doWhatItSays();
            }).catch(function (err) {
                console.log(err);
            });
        })
}

//Tweets
function tweets() {
    var params = { screen_name: 'AlexandGood' };
    client.get('statuses/user_timeline', params, function (error, tweets) {
        if (!error) {
            console.log("20 Latest User Tweets:")
            for (var i = 0; i < 20; i++) {
                console.log((i) + ": " + JSON.parse(tweets));
                console.log("****************************");
            }
        } else {
            throw error;
        }
    });
}

// OMBD Request
var movie = function () {

    inquirer.prompt([
        {
            type: "input",
            message: "What movie would you like to search?",
            name: "movie"
        }
    ]).then(function (inquirerResponse) {
        //grab user input
        var input = inquirerResponse.movie;
        var movieName = "";

        //iterate through input to make into correct format for API call
        for (var i = 0; i < input.length; i++) {
            if (i > 0 && i < input.length) {
                movieName = movieName + "+" + input[i];
            }
            else {
                movieName += input[i];
            }
        }

        var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";
        //make API call and print out info returned
        Request(queryUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("Release Year: " + JSON.parse(body).Year);
                console.log("Movie Title: " + JSON.parse(body).Title);
                console.log("IMDB Rating: " + JSON.parse(body).Rated);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Production location: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
                doWhatItSays();
            }
            else {
                throw error;
            }
            doWhatItSays();
        });
    })
}

//doWhatItSays 
var doWhatItSays = function () {

    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to look up today?",
                choices: ["Tweets", "Songs", "Movies", "Nothing"],
                name: "want"
            }
        ]).then(function (inquirerResponse) {
            if (inquirerResponse.want === "Tweets") {
                tweets();
            }
            else if (inquirerResponse.want === "Songs") {
                song();
            }
            else if (inquirerResponse.want === "Movies") {
                movie();
            }
            else {
                console.log("Goobye :)")
            }
        });
}

doWhatItSays();