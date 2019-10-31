var APIKey = "jj9McEqabmQRWhL1nGOKGFZ1PmaWDWjy";
var keyword = "Twenty One Pilots";
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

var loops;

function getEvents() {
  var queryURL = "https://app.ticketmaster.com/discovery/v2/events?";
  $.ajax({
    url: proxy + queryURL,
    method: "GET",
    dataType: "json",
    data: "apikey=" + APIKey + "&attractionId=" + artistID + "&locale=*",
    success: function(data) {
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
        console.log(data._embedded.events[i]._embedded.venues[0].city);
        localStorage.setItem("city",data._embedded.events[i]._embedded.venues[0].city.name);
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

var other = [];
var otherNum = [];
var theft = [];
var theftNum = [];
var assault = [];
var assaultNum = [];

function crimeAPI() {
  // Crimometer api call

  var endDateMoment = moment(endDateString[0], "YYYY-MM-DD");
  var startDate = endDateMoment.subtract(1, "year");
  var crimeURL =
    "https://private-anon-baa30e29b2-crimeometer.apiary-mock.com/v1/incidents/stats?";
  let lat = latArray[0];
  let lng = lngArray[0];
  $.ajax({
    url: proxy + crimeURL,
    method: "GET",
    dataType: "json",
    data:
      "lat=" +
      lat +
      "&lon=" +
      lng +
      "&distance=10mi&datetime_ini=" +
      startDate +
      "&datetime_end=" +
      endDateMoment +
      ",&source=0",
    success: function(data) {
      console.log(venueCity[0]);
      console.log(latArray[0]);
      console.log(lngArray[0]);
      console.log(data);
      other[0] = data[0].report_types[0].type;
      otherNum[0] = data[0].report_types[0].count;
      theft[0] = data[0].report_types[1].type;
      theftNum[0] = data[0].report_types[1].count;
      assault[0] = data[0].report_types[2].type;
      assaultNum[0] = data[0].report_types[2].count;
    },
    error: function() {
      console.log("error with crime api loop");
    }
  });
}
$(".submit").on("click", function(event) {
  event.preventDefault();
  var artistList = JSON.parse(localStorage.getItem("artists"));
  if (!artistList) {
    artistList = [];
  }
  artistList.push({ keyword });
  localStorage.setItem("artists", JSON.stringify(artistList));
  
  // $(artistName).append("#newArtist");
  $("#newArtist").append(artistName);
  var ticketmaster = $("<a>");
  $(ticketmaster).html("Buy Tickets Here").attr('href', eventURL);
  $("#tickets").append(ticketmaster);



  Highcharts.chart("container", {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false
    },
    title: {
      text: "Crimes<br>" + localStorage.getItem("city") + "<br>Total 1,112",
      align: "center",
      verticalAlign: "middle",
      y: 60
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          distance: -50,
          style: {
            fontWeight: "bold",
            color: "white"
          }
        },
        startAngle: -90,
        endAngle: 90,
        center: ["50%", "75%"],
        size: "110%"
      }
    },
    series: [
      {
        type: "pie",
        name: "Crime Percentage",
        innerSize: "50%",
        data: [['Other', 576], ['Theft', 334], ['Assault', 202]]
      }
    ]
  });
});
