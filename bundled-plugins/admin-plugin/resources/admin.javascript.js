// : Something interesting

define("admin/plugins", [], function(){

  var $table = $("#plugins-table");
  var $elem = $("<table class='aui'>");
  var $thead = $("<thead>");
  var $tr = $("<tr>");
  $tr.append("<th>Plugin</th>");
  $tr.append("<th>Modules</th>");
  var $tbody = $("<tbody>")

  $.getJSON("/rest/api/1.0/plugins", function(json){
    json.forEach(function(plugin){

      var pluginRowElem = $("<tr>");
      var pluginElem = $("<td>"+plugin.name+"</td>");
      var modulesElem = $("<td>");
      var moduleTable = $("<table class='aui'>");
      var moduleThead = $("<thead>");
      moduleThead.append("<tr><th>Name</th><th>Key</th><th>Type</th></tr>");
      var moduleTbody = $("<tbody>");

      plugin.modules.forEach(function(module){
        moduleTbody.append("<tr><td>"+module.name+"</td><td>"+module.key+"</td><td>"+module.type+"</td></tr>");
      });

      moduleTable.append(moduleThead, moduleTbody);
      modulesElem.append(moduleTable);
      pluginRowElem.append(pluginElem, modulesElem);
      $tbody.append(pluginRowElem);

    });

    $thead.append($tr);
    $elem.append($thead, $tbody);
    $table.append($elem);
  })

})

require("admin/plugins");
