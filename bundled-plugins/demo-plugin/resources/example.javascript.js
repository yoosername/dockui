define(
  "example/resource/bundle",
  [],
  function(){

    $("#sidebar-webitem").click(function(){
      alert("This script was provided from a plugin as a WebResource - BOOM!!");
    })

})

require("example/resource/bundle");
