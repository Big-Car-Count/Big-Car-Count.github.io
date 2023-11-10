/*
const map = new maplibregl.Map({
  container: 'map', 
  style: '/style.json',
  center: [0, 0], 
  zoom: 1,
  maxZoom: 13,
  minZoom: 6,
  attributionControl: false,
  hash: false,
  dragPan: false,
  dragRotate: false,
  scrollZoom: false
});

// Add geolocate control to the map.
var geolocate = new maplibregl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
});

map.addControl(geolocate);

map.on('load', function() {
    console.log("Geolocating")
    geolocate.trigger();
});
*/

function flash_tick(){
  
  var div2 = document.getElementById('loading');
  div2.style.display = 'none';
  
  var div = document.getElementById('success');
  div.style.display = 'block';
  
  document.getElementById("nplate").value = ""
  
  // Increment the count
  var count = Number(getCookie("BCC_count")) + 1
  setCookie("BCC_count", count)
  
  
  setTimeout(function() {
      div.style.display = 'none';
  }, 1000);

}

function transformInput() {
  var inputElement = document.getElementById('nplate');
  var inputValue = inputElement.value;

  // Transform to uppercase
  var upperCaseValue = inputValue.toUpperCase();

  // Remove special characters
  var cleanedValue = upperCaseValue.replace(/[^A-Z0-9]/g, '');

  // Update the input field
  inputElement.value = cleanedValue;
}

var loc = document.getElementById("location");

/*
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Success function
            showPosition, 
            // Error function
            null, 
            // Options. See MDN for details.
            {
               enableHighAccuracy: true,
               timeout: 5000,
               maximumAge: 0
            });
    } else { 
        loc.innerHTML = "Your device does not support Geolocation";
        alert("Your device does not support Geolocation")
    }
    
    
}

function showPosition(position) {
    loc.innerHTML="Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;
    return[position.coords.latitude, position.coords.longitude];
  
}
*/


let coords = { latitude: null, longitude: null };

function updateCoords() {
  console.log("Watching Location")
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      coords.latitude = position.coords.latitude;
      coords.longitude = position.coords.longitude;
      loc.innerHTML="" + coords.latitude + "," + coords.longitude;
      //console.log(coords);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

updateCoords();



/*

function getLocation() {
    return new Promise(function(resolve, reject) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // Success function
                function(position) {
                    resolve([position.coords.latitude, position.coords.longitude]);
                }, 
                // Error function
                function(error) {
                    reject(error);
                }, 
                // Options
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else { 
            reject(new Error("Your device does not support Geolocation"));
        }
    });
}

*/



function submitGET(buttonname){
  
  var div = document.getElementById('loading');
  div.style.display = 'block';
  
  console.log("Making GET request");
  
  var base_url = "https://script.google.com/macros/s/AKfycbzFM5RbJhfMp4" + 
  "d3SvRtH-9RpHiHWtMrft8Rl0OBUCWpt1ypBbsAQXvN8rPNlciW8tCD/exec";
  
  var nplate = document.getElementById("nplate").value;
  var numChars = nplate.length;
  
  if(numChars < 4){
    alert("Number plate too short")
    return;
  }
  
  if(numChars > 9){
    alert("Number plate too long");
    return;
  }
  
  setupCookies();
  var did = getCookie("BCC_id");
  var currentDateTime = new Date().toString();
  
  var lng = coords.longitude;
  var lat = coords.latitude;
  
  if(lng === null){
    alert("Your are not sharing your location");
    div.style.display = 'none';
    return;
  }
  
  lng = lng.toFixed(8);
  lat = lat.toFixed(8);
  
  if(lng > 5 || lng < - 5 || lat > 65 || lat < 49){
    alert("Your are not in the UK or are not sharing your location");
    div.style.display = 'none';
    return;
  }
  
  
  
  // Submit query
  
  var query_url = base_url +
      "?plate=" + nplate +
      "&time=" + currentDateTime +
      "&parking_type=" + buttonname +
      "&latitude=" + lat +
      "&longitude=" + lng +
      "&did=" + did;
    
  fetch(query_url, {
      redirect: "follow",
      method: "GET",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the JSON response
  })
  .then(data => {
    flash_tick(); // Flash the tick and clear the form
  })
  .catch(error => {
    console.error('Error:', error); // Log any errors
    var div2 = document.getElementById('loading');
    div2.style.display = 'none';
    alert('An error occurred: ' + error.message); // Show an alert
  });
  
  
  /*
  // Get the location and build the query
  getLocation().then(function(coords) {
    
    
    
  }).catch(function(error) {
      console.log(error);
      var div2 = document.getElementById('loading');
      div2.style.display = 'none';
      alert("Can't find your location, please check that location is enabled.")
  });
  
  /*
  
  
  
  
  var coords = getLocation();
  console.log(coords[0])
  
  var center = map.getCenter();
  var longitude = center.lng;
  var latitude = center.lat;
  
  if(longitude > 5 || longitude < - 5 || latitude > 65 || latitude < 49){
    alert("Your are not in the UK or are not sharing your location")
    return;
  }
  
  */
  
  
  
  if(buttonname == "notparked"){
    alert('For this survey please only record parked vehicles');
  }
  
}