var APIKey = "jj9McEqabmQRWhL1nGOKGFZ1PmaWDWjy";
var keyword = "twenty one pilots";
var queryURL =
  "https://app.ticketmaster.com/discovery/v2/attractions?apikey=" +
  APIKey +
  "&keyword=" +
  keyword +
  "&locale=*";

//From first AJAX call
var artistID;
var artistName;

//From second AJAX call. Each event is represented by an index.
var latArray = [];
var lngArray = [];
var eventName = [];
var venueName = [];
var venueCity = [];
var venueAddress = [];
var eventURL = [];

$.ajax({
  url: queryURL,
  method: "GET",
  success: function(data) {
    if (data.page.totalElements > 0) {
      artistID = data._embedded.attractions[0].id;
      setTimeout(200);
      artistName = data._embedded.attractions[0].name;
      console.log(artistID);
      setTimeout(getEvents(), 500);
    } else {
      alert("Please enter another artist.");
    }
  }
});

function getEvents() {
  console.log("This is the second AJAX call.");
  let queryURL =
    "https://app.ticketmaster.com/discovery/v2/events?apikey=" +
    APIKey +
    "&attractionId=" +
    artistID +
    "&locale=*";
  $.ajax({
    url: queryURL,
    method: "GET",
    success: function(data) {
      console.log(data);
      var loops;
      if (data._embedded.events.length < 3) {
        loops = data._embedded.events.length;
      } else {
        loops = 3;
      }
      for (var i = 0; i < loops; i++) {
        latArray[i] =
          data._embedded.events[i]._embedded.venues[0].location.latitude;
        setTimeout(200);
        lngArray[i] =
          data._embedded.events[i]._embedded.venues[0].location.longitude;
        setTimeout(200);
        eventName[i] = data._embedded.events[i].name;
        setTimeout(200);
        venueName[i] = data._embedded.events[i]._embedded.venues[0].name;
        setTimeout(200);
        venueAddress[i] =
          data._embedded.events[i]._embedded.venues[0].address.line1;
        setTimeout(200);
        venueCity[i] = data._embedded.events[i]._embedded.venues[0].city;
        setTimeout(200);
        eventURL[i] = data._embedded.events[i].url;
        setTimeout(200);
      }
      crimeAPI();
    }
  });

  function crimeAPI() {
    console.log(latArray[0] + ", " + lngArray[0]);
    console.log("Artist name: " + artistName);
    console.log(venueName);
    console.log(venueAddress);
    console.log(venueCity);
    console.log(eventURL);
    console.log(eventName);
  }
}
