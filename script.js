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
}).then(function (response) {
	artistID = response.resultsPage.results.artist[0].id;
});

// Crimometer api call
var lat = resultsPage.results.event[0].location.lat
var lon = resultsPage.results.event[0].location.lng
var endDateString = resultsPage.results.event[0].start.date
var endDateMoment = moment(endDateString, YYYY-MM-DD)
var startDate = endDateMoment().subtract(1,'year')
var crimeURL = "https://api.crimeometer.com/v1/incidents/stats?lat="+lat+"&lon="+lon+"&distance=10mi&datetime_ini="+startDate+"&datetime_end="+endDateString+",&source=0"

$.ajax({
	url: crimeURL,
	method: "GET"
}).then(function(response){
console.log(response)
});