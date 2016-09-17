define(
  "example/resource/bundle",
  [],
  function(){

    $("#sidebar-webitem").click(function(){
      alert("yeah I did something - BOOM!!");
    })

})

require("example/resource/bundle");
