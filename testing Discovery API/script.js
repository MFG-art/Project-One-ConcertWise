var APIKey = "jj9McEqabmQRWhL1nGOKGFZ1PmaWDWjy";
var keyword = "twenty one pilots";
var queryURL =
  "https://app.ticketmaster.com/discovery/v2/attractions?apikey=" +
  APIKey +
  "&keyword=" +
  keyword +
  "&locale=*";

var artistID;
var latArray = [];
var lngArray = [];

$.ajax({
  url: queryURL,
  method: "GET",
  success: function(data) {
    if (data.page.totalElements > 0) {
      artistID = data._embedded.attractions[0].id;
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
        lngArray[i] =
          data._embedded.events[i]._embedded.venues[0].location.longitude;
      }
      crimeAPI();
    }
  });
}

function crimeAPI() {
  console.log(latArray[0] + ", " + lngArray[0]);
}
