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

var lat
var lon
var endDateString

$.ajax({
  url: queryURL2,
  method: "GET"
}).then(function(response) {
  lat = response.resultsPage.results.event[0].location.lat
  lon = response.resultsPage.results.event[0].location.lng
  endDateString = response.resultsPage.results.event[0].start.date

});

var endDateMoment = moment(endDateString, YYYY-MM-DD)
var startDate = endDateMoment().subtract(1,'year')
var crimeURL = "https://private-anon-a3e5aa58c2-crimeometer.apiary-mock.com/v1/incidents/stats?lat="+lat+"&lon="+lon+"&distance=10mi&datetime_ini="+startDate+"&datetime_end="+endDateMoment+",&source=0"

console.log(crimeURL)

$.ajax({
	url: crimeURL,
	method: "GET"
}).then(function(response){
console.log(response)
});
// Crimometer api call