jQuery.githubUser = function(callback) {
  jQuery.getJSON('https://api.github.com/repos/BE-Code/RoomofRequirement.github.io/contents',callback)  // For list of files in repository
}

jQuery.fn.loadDynamicMenu = function() {
  var username = "BE-Code";
  this.html("<span>Querying GitHub for pages...</span>");
  var target = this;
  
  $.githubUser(function(data) {
    //sortByName(data);
    var list = $("<ul>");
    target.empty().append(list);
    $(data).each(function() {
      if (this.name.endsWith(".html") && !this.name.startsWith("index")) {
        var page = this.name.substring(0, this.name.length - 5);
        list.append("<li><a href=\"" + page + "\">" + page + "</a></li>");
      }
    });
    list.append("</ul>");
  });

  function sortByName(repos) {
    repos.sort(function(a,b) {
      return a.name - b.name;
    });
  }
};
