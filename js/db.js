let db;
let firstbuttonname;

function openDatabase() {
  let openRequest = indexedDB.open('formDB', 1);

  openRequest.onupgradeneeded = function(e) {
    let db = e.target.result;
    if (!db.objectStoreNames.contains('formData')) {
      db.createObjectStore('formData', { autoIncrement: true });
    }
  };

  openRequest.onsuccess = function(e) {
    db = e.target.result;
  };

  openRequest.onerror = function(e) {
    console.log('Error opening database');
    console.dir(e);
  };
}
openDatabase();


function saveData(nplate, time, button, lat, lng, did) {
  let data = {
    nplate: nplate,
    time: time,
    button: button,
    lat: lat,
    lng: lng,
    did: did
  };

  let transaction = db.transaction(['formData'], 'readwrite');
  let store = transaction.objectStore('formData');
  let request = store.add(data);

  request.onerror = function(e) {
    console.log('Error saving data');
    console.dir(e);
  };
}

function submitPlate(buttonname){
  
  var consent = getCookie("BCC_consent");
  if(consent != 'true'){
    var consentbox = document.getElementById('firsttime');
    firstbuttonname = buttonname;
    consentbox.style.display = "block";
    return null
  }
  
  if(buttonname == "notparked"){
    alert('For this survey please only record parked vehicles');
  }
  
  console.log("Validating Input");
  var nplate = document.getElementById("nplate").value;
  var check = validNumberPlate(nplate);
  
  if(check){
    var did = getCookie("BCC_id");
    var currentDateTime = new Date().toString();
    
    var lng = coords.longitude;
    var lat = coords.latitude;
    
    lng = Number(lng).toFixed(8);
    lat = Number(lat).toFixed(8);
    
    if(lng > 5 || lng < - 5 || lat > 65 || lat < 49){
      alert("Your are not in the UK or are not sharing your location");
      return;
    }
    
    saveData(nplate, currentDateTime, buttonname, lat, lng, did);
    flash_tick();
    
    if(buttonname == "notparked"){
      alert('For this survey please only record parked vehicles');
    }
  } else {
    var invalidplatename = document.getElementById('invalidplatename');
    invalidplatename.innerHTML = nplate;
    var invalidplate = document.getElementById('invalidplate');
    invalidplate.style.display = "block";
  }
  
}


function sendRequest(data, key){

  console.log("Sending " + key + " " + data.nplate);
  uploading = true;
  
  var base_url = "https://script.google.com/macros/s/AKfycbzFM5RbJhfMp4" + 
  "d3SvRtH-9RpHiHWtMrft8Rl0OBUCWpt1ypBbsAQXvN8rPNlciW8tCD/exec";
  
  var query_url = base_url +
      "?plate=" + data.nplate +
      "&time=" + data.time +
      "&parking_type=" + data.button +
      "&latitude=" + data.lat +
      "&longitude=" + data.lng +
      "&did=" + data.did;
    
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
    if(data.result == "success"){
      deleteFormData(key);
    } else {
      console.log("Failed to submit ");
      console.log(data);
    }
    uploading = false;
  })
  .catch(error => {
    console.error('Error:', error); // Log any errors
    uploading = false;
  });
}


function deleteFormData(id) {
  console.log("Deleting " + id);
  let transaction = db.transaction(['formData'], 'readwrite');
  let store = transaction.objectStore('formData');
  let request = store.delete(id);

  request.onerror = function(e) {
    console.log('Error deleting data');
    console.dir(e);
  };
}

let uploading = false;

function checkDatabase() {
  if(uploading) {
    console.log("Skipping check");
    return
  }
  
  var div1 = document.getElementById('nointernet');
  var div2 = document.getElementById('loading');
  
  
  if (navigator.onLine) {
    div1.style.display = 'none';
    let transaction = db.transaction(['formData'], 'readonly');
    let store = transaction.objectStore('formData');
  
    // Get the first record from store
    let request = store.openCursor();
  
    request.onsuccess = function(event) {
      let cursor = event.target.result;
      if (cursor) {
        div2.style.display = 'block';
        sendRequest(cursor.value, cursor.key)
      } else {
        div2.style.display = 'none';
      }
    };
    
  } else {
    console.log("No internet");
    div1.style.display = 'block';
  }
  
}

// Check the database every 3 seconds
setInterval(checkDatabase, 3000);




