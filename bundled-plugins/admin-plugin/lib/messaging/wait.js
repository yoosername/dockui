var net = require('net');

module.exports = function(host, port, options) {

  options = options || {};
  var retriesRemaining = options.numRetries || 10;
  var retryInterval = options.retryInterval || 1000;
  var timer = null, socket = null;

  return new Promise(function(resolve, reject){

    if (!(retriesRemaining > 0)){
      // rejected// throw new Error('invalid value for option "numRetries"')
      reject('invalid value for option "numRetries"');
    }

    if (!(retryInterval > 0)){
      //throw new Error('invalid value for option "retryInterval"');
      reject('invalid value for option "retryInterval"');
    }

    function clearTimerAndDestroySocket() {
      clearTimeout(timer);
      timer = null;
      if (socket) socket.destroy();
      socket = null;
    }

    function retry() {
      tryToConnect();
    };

    function tryToConnect() {

      clearTimerAndDestroySocket();

      if (--retriesRemaining < 0){
        // reject
      };

      socket = net.createConnection(port, host, function(err) {
        clearTimerAndDestroySocket();
        if (retriesRemaining > 0){
          resolve(null);
        }
      });

      timer = setTimeout(function() { retry(); }, retryInterval);

      socket.on('error', function(err) {
        clearTimerAndDestroySocket();
        setTimeout(retry, retryInterval);
      });

    }

    tryToConnect();

  });

};
