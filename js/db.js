let db;

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
  
  console.log("Sumbitting to DB");
  
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
  
  var did = getCookie("BCC_id");
  var currentDateTime = new Date().toString();
  
  var lng = coords.longitude;
  var lat = coords.latitude;
  
  if(lng === null){
    alert("Your are not sharing your location");
    return;
  }
  
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








/*
function sendRequest(data) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'your-url-here?' + new URLSearchParams(data), true);

  xhr.onload = function() {
    if (xhr.status === 200) {
      // If the request is successful, delete the data from IndexedDB
      deleteFormData(data.id);
    }
  };

  xhr.send();
}
*/

/*
function checkDatabase() {
  console.log("Checking DB")
  let transaction = db.transaction(['formData'], 'readonly');
  let store = transaction.objectStore('formData');

  // Open a cursor to retrieve all records
  let request = store.openCursor();

  request.onsuccess = function(event) {
    let cursor = event.target.result;
    if (cursor) {
      // Pass both the data and the key to sendRequest
      sendRequest(cursor.value, cursor.key);
      cursor.continue();
    }
  };
}
*/
/*

function checkDatabase() {
  console.log("Checking DB")
  
  let transaction = db.transaction(['formData'], 'readonly');
  let store = transaction.objectStore('formData');

  // Open a cursor to retrieve all records
  let request = store.openCursor();

  request.onsuccess = function(event) {
    let cursor = event.target.result;
    if (cursor) {
      // Check if the device has an internet connection
      if (navigator.onLine) {
        // Pass both the data and the key to sendRequest
        sendRequest(cursor.value, cursor.key);
        // Add a delay before continuing to the next record
        setTimeout(() => cursor.continue(), 1000);
      } else {
        console.log('No internet connection');
      }
    }
  };
}
*/

/*
let isChecking = false;


async function checkDatabase() {
  if (isChecking) {
    console.log("Skipping checks");
    return; // If checkDatabase is already running, exit the function
  }
  isChecking = true; // Set the flag to true
  console.log("Checking DB");
  let transaction = db.transaction(['formData'], 'readonly');
  let store = transaction.objectStore('formData');

  // Open a cursor to retrieve all records
  let request = store.openCursor();

  // Array to hold the data
  let dataArray = [];

  request.onsuccess = function(event) {
    let cursor = event.target.result;
    if (cursor) {
      // Add the data and key to the array
      dataArray.push({data: cursor.value, key: cursor.key});
      cursor.continue();
    } else {
      // Process the array after the cursor is done
      processArray(dataArray).then(() => {
        isChecking = false; // Reset the flag when done
      });
    }
  };
}

async function processArray(dataArray) {
  // Check if the device has an internet connection
  if (navigator.onLine) {
    // Process each item in the array one at a time
    let promises = dataArray.map(item => sendRequest(item.data, item.key));
    await Promise.all(promises);
  } else {
    console.log('No internet connection');
  }
}

// Check the database every 5 seconds
//setInterval(checkDatabase, 5000);
*/

/*
function checkDatabase() {
  if (isChecking){
    console.log("Skipping checks");
    return;
  } 
  isChecking = true;
  console.log("Checking DB");
  
  let transaction = db.transaction(['formData'], 'readonly');
  let store = transaction.objectStore('formData');

  // Open a cursor to retrieve all records
  let request = store.openCursor();

  // Array to hold the data
  let dataArray = [];

  request.onsuccess = function(event) {
    let cursor = event.target.result;
    if (cursor) {
      // Add the data and key to the array
      dataArray.push({data: cursor.value, key: cursor.key});
      cursor.continue();
    } else {
      // Process the array after the cursor is done
      processArray(dataArray).then(() => {
        isChecking = false; // Reset the flag when done
      });
    }
  };
  
}

async function processArray(dataArray) {
  // Check if the device has an internet connection
  if (navigator.onLine) {
    // Process each item in the array with a delay
    dataArray.forEach((item, index) => {
      setTimeout(() => sendRequest(item.data, item.key), index * 1000);
    });
  } else {
    console.log('No internet connection');
  }
  
}
*/

/*
function checkDatabase() {
  let transaction = db.transaction(['formData'], 'readonly');
  let store = transaction.objectStore('formData');

  // Get all records from store
  store.getAll().onsuccess = function(event) {
    let data = event.target.result;
    data.forEach(sendRequest);
  };
}
*/

/*
Update this 
function sendRequest(data, key) {
  return new Promise((resolve, reject) => {
    console.log("Sending " + key + " " + data.nplate);
    var div2 = document.getElementById('loading');
    div2.style.display = 'block';

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
      deleteFormData(key);
      resolve(); // Resolve the Promise
      div2.style.display = 'none';
    })
    .catch(error => {
      console.error('Error:', error); // Log any errors
      reject(error); // Reject the Promise
      div2.style.display = 'none';
    });
  });
}
*/
