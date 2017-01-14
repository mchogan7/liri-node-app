//Loads the twitter keys
var keys = require('./keys.js');

//Initializes the NPM packages
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require("request");
var fs = require("fs");

//Variables for the user entered terms
var service = process.argv[2]
var searchTerm = searchArray()

//Call the main search function.
searchService();


//Call the appropriate request call based on the user entered terms.
function searchService() {
    if (service === 'my-tweets') {
        twitterCall();
    }

    if (service === 'spotify-this-song') {
        if (!searchTerm) {
            //If user does not enter a search term, it is set to Ace of Base.
            searchTerm = 'The Sign Ace of Base'
        }
        spotifyCall();
    }

    if (service === 'movie-this') {
        if (!searchTerm) {
        	//If user does not enter a search term, it is set to Mr Nobody.
            searchTerm = 'Mr. Nobody'
        }
        omdbCall();
    }

    if (service === 'do-what-it-says') {
        doIt();
    }
}


//This functions handles search terms with multiple words.
function searchArray() {
    var concat = ''
    for (var i = 3; i < process.argv.length; i++) {
        concat += process.argv[i] + ' '
    }
    return concat
}

//Twitter API call that returns the last 20 of my stupid tweets.
function twitterCall() {
    var client = new Twitter(keys.twitterKeys)
    client.get('search/tweets', { q: 'mills_hogan_ATX', count: 20 }, function(error, tweets, response) {
        console.log('@mills_hogan_ATX last 20 tweets. \n')
        for (var i = 0; i < 20; i++) {
            console.log(tweets.statuses[i].text + '\n');
        }
    });
}

//Spotify API call that logs the required info.
function spotifyCall() {
    spotify.search({ type: 'track', query: searchTerm }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        console.log('Artist: ' + data.tracks.items[0].artists[0].name)
        console.log('Track Title: ' + data.tracks.items[0].name)
        console.log('Preview URL: ' + data.tracks.items[0].preview_url)
        console.log('Album: ' + data.tracks.items[0].album.name)
    });

}

//Movie database API call.
function omdbCall() {
    var queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&tomatoes=true&r=json";

    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {

            console.log('Title: ' + JSON.parse(body).Title)
            console.log('Year: ' + JSON.parse(body).Year)
            console.log('IMDB Rating: ' + JSON.parse(body).imdbRating)
            console.log('Country: ' + JSON.parse(body).Country)
            console.log('Language: ' + JSON.parse(body).Language)
            console.log('Plot: ' + JSON.parse(body).Plot)
            console.log('IMDB Rating: ' + JSON.parse(body).Actors)
            console.log('IMDB Rating: ' + JSON.parse(body).imdbRating)
            console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).tomatoMeter)
            console.log('Rotten Tomatoes URL: ' + JSON.parse(body).tomatoURL)
        }
    });
}

//This function is called if the 'do-what-it-says' service is selected.
//It simply updates the search terms and reruns the searchService function
//to then call the correct API call.
function doIt() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        var doItArray = data.split(',')
        service = doItArray[0]
        searchTerm = doItArray[1]
        searchService()
    });
}
