function flash_tick(){
  
  var div = document.getElementById('success');
  div.style.display = 'block';
  
  platediv = document.getElementById("nplate")
  platediv.value = ""
  platediv.focus();
  
  setTimeout(function() {
      div.style.display = 'none';
  }, 500);
  
  // Increment the count
  var count = Number(getCookie("BCC_count")) + 1
  setCookie("BCC_count", count)
  
}

// Makes numberplates upper case
function transformInput() {
  var inputElement = document.getElementById('nplate');
  var inputValue = inputElement.value;

  // Transform to uppercase
  var upperCaseValue = inputValue.toUpperCase();

  // Remove special characters
  var cleanedValue = upperCaseValue.replace(/[^A-Z0-9]/g, '');

  // Update the input field
  inputElement.value = cleanedValue;
  
  if(validNumberPlate(cleanedValue)){
    inputElement.style.borderColor = "green";
  } else {
    inputElement.style.borderColor = "red";
  }
}


// Valid Number plate
function validNumberPlate(vrm){
  
  if(/^[A-HJ-PR-Y][A-HJ-PR-Y][0-25-7][0-9][A-HJ-PR-Z][A-HJ-PR-Z][A-HJ-PR-Z]$/.test(vrm)){
    console.log(vrm + " post-2001 plate");
    return true
  } else if (/^[A-HJ-NPR-TV-Y][0-9]{1,3}[A-HJ-PR-TV-Y][A-HJ-PR-TV-Y][A-HJ-PR-TV-Y]$/.test(vrm)){
    console.log(vrm + " 1983 to 2001 plate");
    return true
  } else if (/^[A-HJ-PR-Y][A-HJ-PR-Y][A-HJ-PR-Y][0-9]{1,3}[A-HJ-NPR-TV-Y]$/.test(vrm)){
    console.log(vrm + " 1963 to 1984 plate");
    return true
  } else if (/^[A-Z]{1,3}[0-9]{1,4}$/.test(vrm)){
    console.log(vrm + " Dateless letters first or NI plate");
    return true
  } else if (/^[0-9]{1,4}[A-Z]{1,3}$/.test(vrm)){
    console.log(vrm + " Dateless numbers first plate");
    return true
  } else {
    //console.log(vrm + " not valid plate");
    return false
  }
}

var loc = document.getElementById("location");
let coords = { latitude: null, longitude: null };

function updateCoords() {
  console.log("Watching Location")
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      coords.latitude = position.coords.latitude.toFixed(8);
      coords.longitude = position.coords.longitude.toFixed(8);
      loc.innerHTML="" + coords.latitude + "," + coords.longitude;
      //console.log(coords);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function shareCoords() {
  console.log("Sharing Location")
  var inputElement = document.getElementById('location');
  inputElement.innerHTML = '<button style="height: 40px"><image src="/images/spinner.svg" style="height:30px; width:30px;" alt="Checking"></button>';
  
  updateCoords();
  
  setTimeout(function() {
    var inputElement2 = document.getElementById('location');
    //console.log(inputElement2.innerHTML.alt);
    console.log(/spinner/.test(inputElement2.innerHTML));
    if(/spinner/.test(inputElement2.innerHTML)){
      inputElement.innerHTML = '<button onclick="shareCoords()" style="height: 40px">Failed to get location, check your device settings</button>';
    }
  }, 5000);
  
}


updateCoords();


function closeInvalidplate() {
  var inputElement = document.getElementById('invalidplate');
  inputElement.style.display = "none";
}


function closefirsttime(check) {
  var inputElement = document.getElementById('firsttime');
  if(check){
    setCookie('BCC_consent','true');
    submitPlate(firstbuttonname);
  }
  inputElement.style.display = "none";
}

