var APIKey = "jj9McEqabmQRWhL1nGOKGFZ1PmaWDWjy";
var keyword = $("#myinput").val().trim();
var queryURL =
  "https://app.ticketmaster.com/discovery/v2/attractions?apikey=" + APIKey + "&keyword=" + keyword + "&locale=*";

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
var endDateMoment = moment(endDateString, YYYY-MM-DD)
var startDate = endDateMoment().subtract(1,'year')
var crimeURL = "https://private-anon-a3e5aa58c2-crimeometer.apiary-mock.com/v1/incidents/stats?lat="+lat+"&lon="+lon+"&distance=10mi&datetime_ini="+startDate+"&datetime_end="+endDateMoment+",&source=0"

console.log(crimeURL)
// Crimometer api call
$.ajax({
	url: crimeURL,
	method: "GET"
}).then(function(response){
console.log(response)
});

$(".submit").on(click,function(event){
event.preventDefault();
console.log(keyword);
var aritistList =JSON.parse(localStorage.getItem("artists"));
if (!artistList){
  artistList=[];
}
  aritistList.push({keyword})
  localStorage.setItem("artists", JSON.stringify(artistList))
  
})

