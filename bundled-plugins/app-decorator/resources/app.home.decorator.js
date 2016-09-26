// Nothing here yet!!
define(
  "app/home/action/dialog",
  [],
  function(){

    // Hides the dialog when close button in dialog is clicked
    $("#action-button").click(function(e){
      e.preventDefault();
      AJS.dialog2("#demo-dialog").show();
    })

    // Hides the dialog when close button in dialog is clicked
    AJS.$("#dialog-close-button").click(function(e) {
        e.preventDefault();
        AJS.dialog2("#demo-dialog").hide();
    });

})

require("app/home/action/dialog");
