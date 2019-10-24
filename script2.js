var artistName = "Random Name";
var APIkey = "APIkey";
var artistID;

// Using this URL returns a response element that returns the artist ID, needed by other endpoints/AJAX calls.
var queryURL =
  "https://api.songkick.com/api/3.0/search/artists.json?apikey={" +
  APIkey +
  "}&query={" +
  artistName +
  "}";

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
  artistID = response.resultsPage.results.artist[0].id;
});

// Using this URL returns a response element that is used by the Crimometer API
var queryURL2 =
  "https://api.songkick.com/api/3.0/artists/{" +
  artistID +
  "}/calendar.json?apikey={" +
  APIkey +
  "}";

$.ajax({
  url: queryURL2,
  method: "GET"
}).then(function(response) {
  artistID = response.resultsPage.results.artist[0].id;
});
