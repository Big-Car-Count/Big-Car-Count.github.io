// Cookie managment functions
function setCookie(cname, cvalue) {
  var d = new Date();
  d.setTime(d.getTime() + (1000 * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setupCookies(){
  var IDcookie = getCookie("BCC_id");
  if (IDcookie === "") {
    var randomid = Math.random().toString(36).substring(2);
    console.log("Id set to ",randomid);
    setCookie("BCC_id",randomid);
  }
  
  var COUNTcookie = getCookie("BCC_count");
  if (COUNTcookie === "") {
    setCookie("BCC_count",0);
  }
  
}
setupCookies();