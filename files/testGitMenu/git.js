jQuery.githubUser = function(username, callback) {
  jQuery.getJSON('https://api.github.com/repos/BE-Code/RoomofRequirement.github.io/contents',callback)
  //jQuery.getJSON('https://api.github.com/users/'+username+'/repos?callback=?',callback)
  //jQuery.getJSON('https://api.github.com/repos/'+username+'/tempTest/contents)
}

jQuery.fn.loadRepositories = function() {
  var username = "BE-Code";
  this.html("<span>Querying GitHub for sites...</span>");
  var target = this;
  $.githubUser(username, function(data) {
    //var fileList = data.data; // JSON Parsing
    sortByName(data);    
    
    var list = $('<dl/>');
    target.empty().append(list);
    $(data).each(function() {
      if (this.name.endsWith(".html")) {
        list.append("<dt><a href=\"roomofrequirement.gq/" + this.name.substring(0, this.name.length - 5) + "\">" + this.name.substring(0, this.name.length - 5) + "</a>");
        list.append("<dd>Size: " + this.size + "</dd>");
      }
    });      
  });
  
  function sortByName(repos) {
    repos.sort(function(a,b) {
      return a.name - b.name;
    });
  }
};
