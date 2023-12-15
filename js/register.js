function registerDevice(){

  var form = document.getElementById("registerbutton");
  form.innerHTML = '<image src="/images/spinner.svg" style="height:30px; width:30px;" alt="Checking">';
  
  var email = document.getElementById("email").value;
  var email2 = document.getElementById("email2").value;
  
  if(email != email2){
    alert("Emails do not match");
    return null
  }
  
  if(!validateEmail(email)){
    alert("Invalid Email Address");
    return null
  }
  
  
  var did = getCookie("BCC_id");
  
  var register_url = "https://script.google.com/macros/s/AKfycbzTKENIGp3Roy4QWw6WLwmGpKKol-8ymCLqPsEspI6hg8dVmUeOd8cs_lEYo8F6uhvRBw/exec"

  var query_url = register_url +
      "?email=" + email +
      "&did=" + did;
      
  console.log(query_url);
      
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
      setCookie("registered","true");
      closeregistration();
    } else {
      console.log(data);
      alert("Failed to submit ");
    }
  })
  
  .catch(error => {
    console.error('Error:', error); // Log any errors
  });

}

function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function closeregistration(){
  console.log("Checking form")
  var reg = getCookie("registered");
  
  if(reg === "true"){
    var form = document.getElementById("registationform");
    form.innerHTML = "<p><b>Your device is registered<b></p>"
  }
  
}

closeregistration();