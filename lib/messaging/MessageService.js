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

/**
 * DockerService service
 */
 class MessageService extends EventEmitter{
   constructor() {
     super();
     this.host = "rabbitmq";
     this.exchangeName = "plugins";
     this.queueName = "app";
   }

   getHost(){
     return this.host;
   }

   getQueueName(){
     return this.queueName;
   }

   getExchangeName(){
     return this.exchangeName;
   }

   start(){
    var self = this;
    var q = 'tasks';

    return sendMessage('tasks', "Yo this is a message");

   }

 }

module.exports = new MessageService();
