const map = new maplibregl.Map({
  container: 'map', 
  style: 'https://www.carbon.place/pmtiles/style_pbcc_mb.json',
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
    geolocate.trigger();
});

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

function submit(buttonname){
  console.log("Building URL");
  
  var base_url = "https://docs.google.com/forms/d/e/1FAIpQLSe_VBZqPVv6FWFPHjwUvc5gkXcPGanFaTbgGvMPF57ev6N4ww/formResponse?&submit=Submit?usp=pp_url"
  
  var nplate = document.getElementById("nplate").value;
  var numChars = nplate.length;
  
  if(numChars < 4){
    alert("Number plate too short")
    return;
  }
  
  if(numChars > 9){
    alert("Number plate too long")
    return;
  }
  
  var center = map.getCenter();
  var longitude = center.lng;
  var latitude = center.lat;
  
  if(longitude > 5 || longitude < - 5 || latitude > 65 || latitude < 49){
    alert("Your are not in the UK or are not sharing your location")
    return;
  }
  
  var query_url = base_url +
    "&entry.48816149=" + nplate +
    "&entry.139692408=" + 12345 +
    "&entry.1482559351=" + buttonname +
    "&entry.1424032430=" + latitude +
    "&entry.1183165873=" + longitude
    
  console.log(query_url);
  
  changeIframeSrc('form', query_url);
  
  
}


function changeIframeSrc(id, url) {
    var iframe = document.getElementById(id);
    if(iframe) {
        iframe.src = url;
    } else {
        console.log("No iframe found with id: " + id);
    }
}