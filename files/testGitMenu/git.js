jQuery.githubUser = function(username, callback) {
  jQuery.getJSON('https://api.github.com/users/'+username+'/repos?callback=?',callback)
  //jQuery.getJSON('https://api.github.com/repos/'+username+'/tempTest/contents)
  //key: "6dafcde3d401f90b17de05c78ff8bdfdd32de4d3"
}

jQuery.fn.loadRepositories = function() {
  var username = "BE-Code";
  this.html("<span>Querying GitHub for repositories...</span>");
  var target = this;
  $.githubUser(username, function(data) {
    var repos = data.data; // JSON Parsing
    sortByName(repos);    
    
    var list = $('<dl/>');
    target.empty().append(list);
    $(repos).each(function() {
      if (this.name != (username.toLowerCase()+'.github.com')) {
        list.append('<dt><a href="'+ (this.homepage?this.homepage:this.html_url) +'">' + this.name + '</a> <em>'+(this.language?('('+this.language+')'):'')+'</em></dt>');
        list.append('<dd>' + this.description +'</dd>');
      }
    });      
  });
  
  function sortByName(repos) {
    repos.sort(function(a,b) {
      return a.name - b.name;
    });
  }
};
