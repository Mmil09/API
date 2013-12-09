$(document).ready(function() {

// -------------- Functions and Variables

// $.getJSON("http://otter.topsy.com/urlinfo.js?url=http://www.nytimes.com", function(data) {console.log(data.response.oneforty)});

// ------------ Start of program

$.ajax({

    url: "https://maps.googleapis.com/maps/api/directions/json?origin=Boston,MA&destination=Melrose,MA&sensor=false&callback=?",
    dataType: 'json',
    success: function(results){
        console.log(results.status);
        alert(results.status);
    }

});


/* $.getJSON("http://api.census.gov/data/2010/sf1?key=3d4efe4b5af318153a35f59d317c49eab02619d6&get=P0010001,NAME&for=state", function(results) {
	alert('success!');
	console.log(results);

}); */

/* $.getJSON("http://api.census.gov/data/2011/acs5?key=3d4efe4b5af318153a35f59d317c49eab02619d6&get=B25070_003E,NAME&for=county:*&in=state:06", function(results) {
    alert('success!');
    console.log(results);
}); */

function initialize()
{
var mapProp = {
  center:new google.maps.LatLng(51.508742,-0.120850),
  zoom:5,
  mapTypeId:google.maps.MapTypeId.ROADMAP
  };
var map=new google.maps.Map(document.getElementById("mapImage")
  ,mapProp);
}

google.maps.event.addDomListener(window, 'load', initialize);
    
});
