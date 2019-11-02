var proxy = "https://chriscastle.com/proxy/index.php?:proxy:";
var latArray = [];
var lngArray = [];
var artistName;
var eventName = [];
var venueName = [];
var venueCity = [];
var streetAddress = [];
var eventURL = [];
var endDateString = [];
var eventState;
var aggravatedAssault, theftFromMotorVehicle, drugViolations;

function getAttractionID(keyword) {
  var queryURL = "https://app.ticketmaster.com/discovery/v2/attractions?";
  var APIKey = "jj9McEqabmQRWhL1nGOKGFZ1PmaWDWjy";
  // This AJAX call takes the user input and returns the artist ID
  $.ajax({
    url: proxy + queryURL,
    method: "GET",
    dataType: "json",
    data: "apikey=" + APIKey + "&keyword=" + keyword + "&locale=*",
    success: function(data) {
      if (data.page.totalElements > 0) {
        console.log(data);
        // if there are more than one artist ID, select the first item
        artistName = data._embedded.attractions[0].name;
        var artistID = data._embedded.attractions[0].id;
        setTimeout(getEvents(artistID), 200); // waits for 200 ms and then calls getEvents()
      } else {
        alert("Please enter another artist."); // replace this with MODAL!
      }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log("Error!");
    }
  });
}

function getEvents(artistID) {
  var queryURL = "https://app.ticketmaster.com/discovery/v2/events?";
  var APIKey = "jj9McEqabmQRWhL1nGOKGFZ1PmaWDWjy";
  $.ajax({
    url: proxy + queryURL,
    method: "GET",
    dataType: "json",
    data: "apikey=" + APIKey + "&attractionId=" + artistID + "&locale=*",
    success: function(data) {
      console.log(data);
      var loops;
      if (data._embedded.events.length < 3) {
        // this makes it so that only three or less events are displayed
        loops = data._embedded.events.length;
      } else {
        loops = 3;
      }
      for (var i = 0; i < loops; i++) {
        eventName[i] = data._embedded.events[i].name;
        venueName[i] = data._embedded.events[i]._embedded.venues[0].name;
        venueCity[i] = data._embedded.events[i]._embedded.venues[0].city;
        streetAddress[i] =
          data._embedded.events[i]._embedded.venues[0].address.line1;
        eventURL[i] = data._embedded.events[i].url;
        eventState =
          data._embedded.events[i]._embedded.venues[0].state.stateCode;
      }
      crimeAPI();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log("Error!");
    }
  });
}

function crimeAPI() {
  var crimeURL =
    "https://api.usa.gov/crime/fbi/sapi/api/data/nibrs/aggravated-assault/offense/states/" +
    eventState +
    "/COUNT?";
  var APIKey = "iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv";

  // Crimometer api call
  $.ajax({
    url: proxy + crimeURL,
    method: "GET",
    dataType: "json",
    data: "API_KEY=" + APIKey,
    success: function(data) {
      console.log(data);
      var index = data.results.length - 1;
      aggravatedAssault = data.results[index].offense_count;
      crimeAPICall2();
    },
    error: function(data) {
      console.log(data);
      console.log("error");
    }
  });

  function crimeAPICall2() {
    var crimeURL =
      "https://api.usa.gov/crime/fbi/sapi/api/data/nibrs/theft-from-motor-vehicle/offense/states/" +
      eventState +
      "/COUNT?";
    var APIKey = "iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv";

    $.ajax({
      url: proxy + crimeURL,
      method: "GET",
      dataType: "json",
      data: "API_KEY=" + APIKey,
      success: function(data) {
        console.log(data);
        var index = data.results.length - 1;
        theftFromMotorVehicle = data.results[index].offense_count;
        crimeAPICall3();
      },
      error: function(data) {
        console.log(data);
        console.log("error");
      }
    });
  }

  function crimeAPICall3() {
    var crimeURL =
      "https://api.usa.gov/crime/fbi/sapi/api/data/nibrs/drug-violations/offense/states/" +
      eventState +
      "/COUNT?";
    var APIKey = "iiHnOKfno2Mgkt5AynpvPpUQTEyxE77jo1RU8PIv";

    $.ajax({
      url: proxy + crimeURL,
      method: "GET",
      dataType: "json",
      data: "API_KEY=" + APIKey,
      success: function(data) {
        console.log(data);
        var index = data.results.length - 1;
        drugViolations = data.results[index].offense_count;
        displayStuff();
      },
      error: function(data) {
        console.log(data);
        console.log("error");
      }
    });
  }
}

function displayStuff() {
  $("#newArtist").append(artistName);
  var ticketmaster = $("<a>");
  $(ticketmaster)
    .html("Buy Tickets Here")
    .attr("href", eventURL[0]);
  $("#tickets").append(ticketmaster);

  Highcharts.chart("container", {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: 0,
      plotShadow: false
    },
    title: {
      text: "Crimes",
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
        data: [
          ["Aggrevated Assault", aggravatedAssault],
          ["Theft from Vehicle", theftFromMotorVehicle],
          ["Drug Violation", drugViolations]
        ]
      }
    ]
  });
}

$(".submit").on("click", function(event) {
  event.preventDefault();

  keyword = $("#myinput").val();
  keyword = keyword.trim();
  keyword = encodeURI(keyword);

  getAttractionID(keyword);
});
