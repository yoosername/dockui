define("example/plugins", [], function(){

  var $ul = $("#pluginslist").append("<ul>");

  $.getJSON("/rest/api/1.0/plugins", function(json){
    json.forEach(function(plugin){
      $ul.append("<li>"+plugin.name+"</li>");
    })
  })

})

require("example/plugins");
