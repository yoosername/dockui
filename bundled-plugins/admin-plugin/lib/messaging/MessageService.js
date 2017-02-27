const EventEmitter = require('events');
var amqplib = require('amqplib');
var wait = require('./wait');

const MESSAGING_HOST = "rabbitmq";

var sendMessage = function(q, msg){
  return wait(MESSAGING_HOST, 5672)
  .then(function(){
    return amqplib.connect(`amqp://${MESSAGING_HOST}`)
  })
  .then(function(conn){
    return conn.createChannel();
  })
  .then(function(ch){
    return ch.assertQueue(q)
    .then(function(ok) {
      return ch.sendToQueue(q, new Buffer(msg));
    });
  })
}

var startRecievingMessages = function(q){
  return wait(MESSAGING_HOST, 5672)
  .then(function(){
    return amqplib.connect(`amqp://${MESSAGING_HOST}`)
  })
  .then(function(conn){
    return conn.createChannel();
  })
  .then(function(ch){
    return ch.assertQueue(q)
    .then(function(ok) {
      ch.consume(q, function(msg) {
        console.log(" [x] Received %s", msg.content.toString());
      }, {noAck: true});
    });
  })
}

// TODO: Use the message queue to decide if plugins need reloading
// TODO: E.g. in Dev mode, nodemon should be able to trigger PluginService to drop the plugin and reload it

/**
 * MessageService
 */
 class MessageService extends EventEmitter{
   constructor() {
     super();
     this.host = MESSAGING_HOST;
     this.queueName = "dockui";
   }

   start(){
      startRecievingMessages(this.queueName);
   }

   sendMessage(msg){
    return sendMessage(this.queueName, msg);
   }

   getHost(){
     return this.host;
   }

   getQueueName(){
     return this.queueName;
   }

 }

module.exports = new MessageService();
