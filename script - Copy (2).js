$(document).ready(function() {

// -------------- Functions and Variables

// $.getJSON("http://otter.topsy.com/urlinfo.js?url=http://www.nytimes.com", function(data) {console.log(data.response.oneforty)});

// ------------ Start of program

/*
$.ajax({

    url: "https://maps.googleapis.com/maps/api/directions/json?origin=Boston,MA&destination=Melrose,MA&sensor=false&callback=?",
    dataType: 'json',
    success: function(results){
        console.log(results.status);
        alert(results.status);
    }

}); */


/* $.getJSON("http://api.census.gov/data/2010/sf1?key=3d4efe4b5af318153a35f59d317c49eab02619d6&get=P0010001,NAME&for=state", function(results) {
	alert('success!');
	console.log(results);

}); */

/* $.getJSON("http://api.census.gov/data/2011/acs5?key=3d4efe4b5af318153a35f59d317c49eab02619d6&get=B25070_003E,NAME&for=county:*&in=state:06", function(results) {
    alert('success!');
    console.log(results);
}); */

var directionsDisplay = new google.maps.DirectionsRenderer(),
    directionsService = new google.maps.DirectionsService(),
    // sv = new google.maps.StreetViewPanorama(),
    def = new google.maps.LatLng(51.508742,-0.120850),
    start = "Boston, MA",
    end = "Melrose, MA";

function initialize() {
var mapProp = {
  center: new google.maps.LatLng(51.508742,-0.120850),
  zoom:16,
  mapTypeId: google.maps.MapTypeId.ROADMAP
  };
var map = new google.maps.Map(document.getElementById("mapImage"), mapProp);

directionsDisplay.setMap(map);
};

google.maps.event.addDomListener(window, 'load', initialize);

var panorama = map.getStreetView();
var panoOptions = {
  position: def,
  visible: true,
};
panorama.setOptions(panoOptions);


var streetviewService = new google.maps.StreetViewService();

var radius = 50;
streetviewService.getPanoramaByLocation(def, radius, function(result, status) {
  if (status == google.maps.StreetViewStatus.OK) {
    google.maps.event.addListener(panorama, 'links_changed', function() {
        createCustomLinks(result.location.pano);
    });
  }
});

var request = {
  origin: "Boston, MA",
  destination: "Plymouth, MA",
  travelMode: google.maps.TravelMode.DRIVING
};

directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
      console.log(result.routes[0].overview_path[0]);
      var latitude = result.routes[0].overview_path[0].pb,
          longitute = result.routes[0].overview_path[0].qb;
      // for (var i = 0, i < result.length, i++)
      $('#streetImage').attr("src", "http://maps.googleapis.com/maps/api/streetview?size=400x400&location=" + latitude + "," + longitute + "&fov=90&heading=235&pitch=10&sensor=false");

      }
  });


    
});
