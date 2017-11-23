const EventEmitter = require('events');
var wait = require('./wait');

const RABBIT_HOST = "rabbitmq";
const RABBIT_PORT = "5672";
const RABBIT_URL = "amqp://" + RABBIT_HOST;
const DOCKUI_EVENTS_TOPIC = "events";


// TODO: Use the message queue to decide if plugins need reloading
// TODO: E.g. in Dev mode, nodemon should be able to trigger PluginService to drop the plugin and reload it

/**
 * MessageService
 */
 class MessageService extends EventEmitter{
   constructor() {
     super();
     this.url = RABBIT_URL;
     this.topic = DOCKUI_EVENTS_TOPIC;
     this.context = null;
     this.pub = null;
     this.sub = null;
   }

   startReceiving(callback){
      var self = this;

      return wait(RABBIT_HOST, RABBIT_PORT)
      .then(function(){
        self.context = require("rabbit.js").createContext(RABBIT_URL);
      })
      .then(function(){

        // Listen for  messages to emit as events.
        self.context.on('ready', function() {

          // Setup listener
          self.sub = self.context.socket('SUB', {routing: self.topic});
          self.pub = self.context.socket('PUB', {routing: self.topic});
          self.sub.setEncoding('utf8');
          self.sub.on('data', function(event) {
            console.log("RECEIVED EVENT: %s", event);
          });

        });

        self.context.on('error', function(error){
            console.log("ERROR RECEIVED ON RABBIT CONTEXT: %s", error);
        });

      });

   }

   sendMessage(msg){
     this.pub.connect(DOCKUI_EVENTS_TOPIC, function() {
       pub.write(msg, 'utf8');
     });
   }

   getHost(){
     return this.host;
   }

   getQueueName(){
     return this.queueName;
   }

 }

var service = new MessageService();

module.exports = service;
