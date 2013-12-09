var mapProp, panoOptionsLeft, panoOptionsAhead, panoOptionsRight, map, panorama;
var latitude, longitude;

var directionsDisplay = new google.maps.DirectionsRenderer(),
    directionsService = new google.maps.DirectionsService(),
    defaultCenter = new google.maps.LatLng(42.357627,-71.063457),
    pitchDefault = 0,
    headingAhead = -20,
    headingLeft = headingAhead - 135,
    headingRight = headingAhead + 135;

var initialize = function() { 

mapProp = {
    center: defaultCenter,
    zoom:16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    };

panoOptionsLeft = {position: defaultCenter, panControl: false, linksControl: false, clickToGo: false, zoomControl:true, addressControl: false, pov: {heading: headingLeft, pitch: pitchDefault}};
panoOptionsAhead = {position: defaultCenter, panControl: false, linksControl: false, clickToGo: false, zoomControl:true, pov: {heading: headingAhead, pitch: pitchDefault}};
panoOptionsRight = {position: defaultCenter, panControl: false, linksControl: false, clickToGo: false, zoomControl:true, addressControl: false, pov: {heading: headingRight, pitch: pitchDefault}};

map = new google.maps.Map(document.getElementById("mapImage"), mapProp);

// panorama = new google.maps.StreetViewPanorama(document.getElementById('ahead'), panoOptionsAhead),

panorama = {
  left: new google.maps.StreetViewPanorama(document.getElementById('left'), panoOptionsLeft),
  ahead: new google.maps.StreetViewPanorama(document.getElementById('ahead'), panoOptionsAhead),
  right: new google.maps.StreetViewPanorama(document.getElementById('right'), panoOptionsRight)
};

// map.setStreetView(panorama.left);
map.setStreetView(panorama.ahead);
// map.setStreetView(panorama.right);

};

// ------------------- START OF PROGRAM ---------------------

google.maps.event.addDomListener(window, 'load', initialize); // waits until the page DOM has finished loading before google map data is inserted, or else google maps API will show errors

$(document).ready(function() {

$('#controls').hide();
$('#slider').slider();
$('#start').button({ icons: {primary: "ui-icon-seek-first"}});
$('#previous').button({ icons: {primary: "ui-icon-seek-prev"}});
$('#stop').button({ icons: {primary: "ui-icon-stop"}});
$('#play').button({ icons: {primary: "ui-icon-play"}});
$('#next').button({ icons: {primary: "ui-icon-seek-next"}});
$('#end').button({ icons: {primary: "ui-icon-seek-end"}});

var toggleControls = function() {
  $('#controls').show(500);
}

var createDirections = function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {

    var routePoint = 0; //will be the universal place-holder that the slider and controls change
    var maxLength = result.routes[0].overview_path.length - 1; //highest number point in the array of the route
    var proceed = true;
    
    var changeHeading = function(point1, point2) {
          
        var lat1, lng1, lat2, lng2;
        lat1 = result.routes[0].overview_path[point1].pb;
        lng1 = result.routes[0].overview_path[point1].qb;
        lat2 = result.routes[0].overview_path[point2].pb;
        lng2 = result.routes[0].overview_path[point2].qb;
        var deltaY = lng2 - lng1;
        var deltaX = lat2 - lat1;
        var angleInDegrees = Math.atan2(deltaY, deltaX) * 180/Math.PI;
        console.log(angleInDegrees);
        return angleInDegrees;
        /*
        var dLon = (lng2-lng1);
        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
        var brng = (Math.atan2(y, x)) * 180/Math.PI;
        return 360 - ((brng + 360) % 360);
        */
    };

    var panAndZoom = function() {
      map.panTo(newCenter); // pan to the new center
      map.setZoom(16);
      };

    var updatePosition = function() {
        latitude = result.routes[0].overview_path[routePoint].pb;
        longitude = result.routes[0].overview_path[routePoint].qb;
        newCenter = new google.maps.LatLng(latitude, longitude);
        panorama.ahead.setPosition(newCenter);
        if (routePoint != maxLength)  
          panorama.ahead.setPov({heading: changeHeading(routePoint, routePoint + 1), pitch: pitchDefault});
        if (map.getBounds().contains(newCenter) == false) {
          map.panTo(newCenter);
          }
        $('#slider').slider("value", routePoint); //update slider position
        $('#sliderValue').text((routePoint + 1) + " / " + maxLength).css('left', ((routePoint/maxLength)*600 - 35 + "px"));
      };

    var incrementPosition = function() {
        if (routePoint < maxLength && proceed == true) {
          updatePosition();
          routePoint++;
          play();
        }
        else 
        return;
       };

      var play = function() {
        proceed = true;
        if (routePoint == maxLength)
          return;
        else
          setTimeout(incrementPosition, 1000); 
        };

      directionsDisplay.setDirections(result);  // create directions from the result of directionsService.route()
      directionsDisplay.setMap(map);  // have the directions renderer render the directions on the map
      latitude = result.routes[0].overview_path[0].pb; // new starting latitude, first point of the route
      longitude = result.routes[0].overview_path[0].qb; // new starting longitude, first point of the route   
      var newCenter = new google.maps.LatLng(latitude, longitude); // create a LatLng object for the new center
      panorama.ahead.setPosition(newCenter);  // pan to the new center in the street view image
      panorama.ahead.setPov({heading: changeHeading(0, 1), pitch: pitchDefault}); // change the pov to be heading in the correct initial direction
      

      $('#sliderValue').text((routePoint + 1) + " / " + maxLength);  

      $('#play').click(play);
      $('#start').click(function() {
        routePoint = 0;
        updatePosition();
      });
      $('#end').click(function() {
        routePoint = maxLength;
        updatePosition();
      });
      $('#previous').click(function() {
        if (routePoint != 0) {
          routePoint--;
          updatePosition();
        }
        else
          return;
      });
      $('#next').click(function() {
        if (routePoint != maxLength) {
          routePoint++;
          updatePosition();
        }
        else
          return;
      });
      $('#stop').click(function() {
        if (proceed == true)
          proceed = false;
      });

      $('#slider').slider("option", {
        min: 0, 
        max: maxLength - 1,
        slide: function(event, ui) {
        routePoint = ui.value;
        updatePosition();
        }
      });

      setTimeout(panAndZoom, 100); //this function that re-centers and zooms the map would not work unless there was a delay - this is due to the asynchronous nature of AJAX
    }
  };

var createRoute = function() {
  var request = {
      origin: $('#startAddress').val(),
      destination: $('#endAddress').val(),
      travelMode: google.maps.TravelMode.DRIVING
      };
    if (request.origin == "" || null) {
       alert("Please type an address into the start address");
       return;
    }
    else if (request.destination == "" || null) {
      alert("Please type an address into the end address");
      return;
    }
    else {
    directionsService.route(request, createDirections);
    toggleControls();
  }
};

$('#submitButton').on("click", createRoute);
$(document).keyup(function(e) {
      if (e.keyCode == 13) {
    createRoute();
    }
  });
    
});