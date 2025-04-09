//Test script
addEventListener('resize',resized);
function resized (){
  console.log("I have been resized");
}

// converts time to milliseconds
// Ex. 1d is 1 day or 86400000 milliseconds
function time(time) {
  let x = [1000,60,60,24,365]; //unit conversion
  let y = ["s","m","h","d","y"]; //unit name
  let z = [parseInt(time,10)]; //Number time
  z.push(time.substring((z[0] + "").length)); //type of time
  let result = z[0]; //setup result
  for (var i = 0; i - 1 < y.indexOf(z[1]); i++) result *= x[i]; //cool one line for statement!
  return(result);
}


const searchParams = new URL(window.location.href).searchParams;

const entries = new URLSearchParams(searchParams).entries();

const url = Array.from(entries);

function ar2ob(x){
  let result = {};
  for (var i = 0; i < x.length; i++) {
    result[x[i][0]] = x[i][1];
  }
  return(result);
}




// Even this site has cookies, ALL SITES HAVE COOKIES! MUAHAHAHA
// suprisingly its not even that late while writing this, just 12:24 am on a monday... T^T
// Btw this is not my code... I have no idea how it works but it does, so im not going to question it
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (time(exdays))); //time() is my code! its to make setting the expiration date easier 
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return("");
}