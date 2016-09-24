const EventEmitter = require('events');
const monitor = require('node-docker-monitor');
const exec = require('child-process-promise').exec;


var lookupGateway = function(){

  // Get the gateway for this monitor container
  return exec("netstat -nr | grep '^0\.0\.0\.0' | awk '{print $2}'")
    .then(function(result){

      if (result.error) {
        console.error(`exec error: ${result.error}`);
        return null;
      }

      return result.stdout.replace(/\n/,'');;

    })

}

/**
 * DockerService service
 */
 class DockerService extends EventEmitter{
   constructor() {
     super();
     this.network = "host";
     this.gateway = "127.0.0.1";
     this.monitoring = false;
   }

   getGateway(){
     return this.gateway;
   }

   isMonitoring(){
     return this.monitoring;
   }

   startMonitor(onContainerUp, onContainerDown){

     var self = this;

     return lookupGateway()
     .then(function(gateway){
       self.gateway = gateway;

       monitor({
           onContainerUp: onContainerUp,
           onContainerDown: onContainerDown
       });
       console.log("DockerService is monitoring - gateway set to ", self.gateway);

       self.monitoring = true;
     })

   }

 }

module.exports = new DockerService();
