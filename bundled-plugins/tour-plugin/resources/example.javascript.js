define(
  "example/resource/bundle",
  [],
  function(){

    // Hides the dialog when close button in dialog is clicked
    $("#app-nav-action-button-weblink").click(function(e){
      e.preventDefault();
      AJS.dialog2("#demo-dialog").show();
    })

    // Hides the dialog when close button in dialog is clicked
    AJS.$("#dialog-close-button").click(function(e) {
        e.preventDefault();
        AJS.dialog2("#demo-dialog").hide();
    });

})

require("example/resource/bundle");
