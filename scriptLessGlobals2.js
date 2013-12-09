var initialize = function() { 

var latitude, longitude;

var directionsDisplay = new google.maps.DirectionsRenderer(),
    directionsService = new google.maps.DirectionsService(),
    defaultCenter = new google.maps.LatLng(51.508742,-0.120850),
    start = "Boston, MA",
    end = "Melrose, MA";


var mapProp = {
    center: defaultCenter,
    zoom:16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    };

var panoOptions = {
    position: defaultCenter,
    pov: {
    heading: 34, 
    pitch: 10
  }
};

var map = new google.maps.Map(document.getElementById("mapImage"), mapProp);
var panorama = new google.maps.StreetViewPanorama(document.getElementById('streetImageHolder'), panoOptions);

map.setStreetView(panorama);

var request = {
  origin: "Boston, MA",
  destination: "Plymouth, MA",
  travelMode: google.maps.TravelMode.DRIVING
};



 var directionFunction = function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
      latitude = result.routes[0].overview_path[0].qb;
      longitude = result.routes[0].overview_path[0].pb;
      console.log("inside function:" + latitude + " " + longitude);  
      return latitude, longitude;      
      // directionsDisplay.setMap(map);
      }
  };

console.log("outside function: " + latitude + " " + longitude);
directionsService.route(request, directionFunction);

// map.center = new google.maps.LatLng(latitude, longitude);
// console.log("new: " + typeof latitude);
directionsDisplay.setMap(map);

};



google.maps.event.addDomListener(window, 'load', initialize);





// $(document).ready(function() {
    
// });
