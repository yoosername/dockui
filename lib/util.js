const http = require("http");

function tryUntilSuccess(options, validateFn, callback) {

    //console.info("options: ", options);

    var req = http.request(options, function(res) {

        //console.log("request started");

        var partial = "";
        res.on("data", function(msg) {
          //console.log("some data: ", msg);
            partial += msg.toString("utf-8");
        });
        res.on("end", function() {
          //console.log("stream ended");
            var parsed = JSON.parse(partial);
            if (validateFn(parsed)) {
                callback(null, parsed);
            } else {
                tryUntilSuccess(options, validateFn, callback);
            }
        });
    });

    req.end();

    req.on('error', function(e) {
      //console.log("Error: ", e);
      tryUntilSuccess(options, validateFn, callback);
    });
}

function notNull(thing){
  var something = "undefined";
  return thing || something;
}

exports.tryUntilSuccess = tryUntilSuccess;
exports.notNull = notNull;
