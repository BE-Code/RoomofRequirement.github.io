var endpoint = "https://www.jsonstore.io/4854b44d8da280ff6d53fb4b66d7e536310bf40d793c9b8cee1675a34cba2336";

function getrandom() {
  var random_string = Math.random().toString(32).substring(2, 5) + Math.random().toString(32).substring(2, 5);
  return random_string();
}

function geturl() {
  var url = document.getElementById("urlinput").value;
  var protocol_ok = url.startsWith("http://") || url.startsWith("https://") || url.startsWith("ftp://");
  if (!protocol_ok) {
    newurl = "http://" + url;
    return newurl;
  } else {
    return url;
  }
}

function genhash() {
  if (window.location.hash == "") {
    window.location.hash = getrandom();
  }
}

function send_request(url) {
  this.url = url;
  $.ajax({
    'url': endpoint + "/" + window.location.hash.substr(1),
    'type': 'POST',
    'data': JSON.stringify(this.url),
    'dataType': 'json',
    'contentType': 'application/json; charset=utf-8'
  })
}

function shorturl() {
  var longurl = geturl();
  genhash();
  send_request(longurl);
  
  var hashh = window.location.hash.substr(1);
  if (window.location.hash != "") {
    $.getJSON(endpoint + "/" + hashh, function (data) {
      data = data["result"];
      if (data != null) {
        window.location.href = data;
      }
    });
  }
}





















