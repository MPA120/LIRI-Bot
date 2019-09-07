require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var Spotify = require ('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var defaultMovie = "Top Gun";

var action = process.argv[2];
var value = process.argv[3];

switch (action){
    case "concert-this":
        getBands(value)
        break;
    case "spotify-this-song":
        getSongs(value)
        break;
    case "movie-this":
        if (value == "") {
            value = defaultMovie;
        }
        getMovies(value)
        break;
    case "do-what-it-says":
        doWhatItSays()
        break;
        default:
        break;
}

function getBands(artist){
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function (response) {
            console.log("Venue:", response.data[0].venue.name);
            console.log("Location:", response.data[0].venue.city);
            var eventDate = moment(response.data[0].datetime).format('MM/DD/YYY');
            console.log("Date of the Event:", eventDate);
        })
        .catch(function (error) {
            console.log(error);
        });

}

function getSongs(songName){
    if (songName ==="") {
        songName = "Fluorescent Adolescent";
    }
    spotify.search({type: 'track', query: songName }, function (err,data){
        if (err) {
            return console.log ("Error occurred: " + err);
        }
        console.log("Artist: ", data.tracks.items[0].album.artists[0].name)
        console.log("Preview Link: ", data.tracks.items[0].preview_url)
        console.log("Album Name: ", data.tracks.items[0].album.name)
    });
}

function getMovies(movieName) {
    axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + movieName)
        .then(function (data) {
            var results = `
            Movie Title: ${data.data.Title}
            Year of Release: ${data.data.Year}
            IMDB Rating: ${data.data.Raated}
            Rotten Tomatoes Rating: ${data.data.Ratings[1].Value}
            Country: ${data.data.Country}
            Language: ${data.data.Language}
            Plot: ${data.data.Plot}
            Actors: ${data.data.Actors}`;
            console.log(results)
        })

        .catch(function(error){
            console.log("---------");
            console.log ("Top Gun is the best movie!" )
        }
        )}
function doWhatItSays(){
    fs.readFile("random.txt", "utf8", function(err, data){
        data=data.split(",");
        var action = data[0]
        var value = data[1]

        switch (action) {
            case "concert-this":
                getBands(value)
                break;
            case "spotify-this-song":
                getSongs(value)
                break;
            case 'movie-this':
                getMovies(value)
                break;
                default:
                break;

        }

    })
}
