var APIKey = "jj9McEqabmQRWhL1nGOKGFZ1PmaWDWjy";
var keyword = "twenty one pilots";
keyword = encodeURI(keyword);
var queryURL = "https://app.ticketmaster.com/discovery/v2/attractions?";
var proxy = "https://chriscastle.com/proxy/index.php?:proxy:";
var artistID;
var latArray = [];
var lngArray = [];
var artistName;
var eventName = [];
var venueName = [];
var venueCity = [];
var streetAddress = [];
var eventURL = [];
var endDateString = [];

// This AJAX call takes the user input and returns the artist ID
$.ajax({
  url: proxy + queryURL,
  method: "GET",
  dataType: "json",
  data: "apikey=" + APIKey + "&keyword=" + keyword + "&locale=*",
  success: function(data) {
    if (data.page.totalElements > 0) {
      // if there are more than one artist ID, select the first item
      artistName = data._embedded.attractions[0].name;
      artistID = data._embedded.attractions[0].id;
      setTimeout(getEvents(), 500); // waits for 500 ms and then calls getEvents()
    } else {
      alert("Please enter another artist."); // replace this with MODAL!
    }
  },
  error: function(XMLHttpRequest, textStatus, errorThrown) {
    console.log("Error!");
  }
});

function getEvents() {
  var queryURL = "https://app.ticketmaster.com/discovery/v2/events?";
  $.ajax({
    url: proxy + queryURL,
    method: "GET",
    dataType: "json",
    data: "apikey=" + APIKey + "&attractionId=" + artistID + "&locale=*",
    success: function(data) {
      var loops;
      if (data._embedded.events.length < 3) {
        // this makes it so that only three or less events are displayed
        loops = data._embedded.events.length;
      } else {
        loops = 3;
      }
      for (var i = 0; i < loops; i++) {
        latArray[i] =
          data._embedded.events[i]._embedded.venues[0].location.latitude;
        lngArray[i] =
          data._embedded.events[i]._embedded.venues[0].location.longitude;
        eventName[i] = data._embedded.events[i].name;
        venueName[i] = data._embedded.events[i]._embedded.venues[0].name;
        venueCity[i] = data._embedded.events[i]._embedded.venues[0].city;
        streetAddress[i] =
          data._embedded.events[i]._embedded.venues[0].address.line1;
        eventURL = data._embedded.events[i].url;
        endDateString = data._embedded.events[i].dates.start.localDate;
      }
      crimeAPI();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log("Error!");
    }
  });
}

function crimeAPI() {}
var endDateMoment = moment(endDateString[0], "YYYY-MM-DD");
var startDate = endDateMoment.subtract(1, "year");
var crimeURL =
  "https://private-anon-a3e5aa58c2-crimeometer.apiary-mock.com/v1/incidents/stats?";

// Crimometer api call
$.ajax({
  url: proxy + crimeURL,
  method: "GET",
  dataType: "json",
  data:
    "lat=" +
    latArray[0] +
    "&lon=" +
    lngArray[0] +
    "&distance=10mi&datetime_ini=" +
    startDate +
    "&datetime_end=" +
    endDateMoment +
    ",&source=0"
}).then(function(response) {
  console.log(response);
});

$(".submit").on("click", function(event) {
  event.preventDefault();
  var artistList = JSON.parse(localStorage.getItem("artists"));
  if (!artistList) {
    artistList = [];
  }
  artistList.push({ keyword });
  localStorage.setItem("artists", JSON.stringify(artistList));
});
