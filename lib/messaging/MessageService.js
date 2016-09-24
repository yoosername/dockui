const EventEmitter = require('events');
var amqplib = require('amqplib');

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

       // Set a check here to make sure rabbitmq has actually loaded before we try.
        var open = amqplib.connect('amqp://rabbitmq');

        // Publisher
        return open.then(function(conn) {
          return conn.createChannel();
        }).then(function(ch) {
          return ch.assertQueue(q).then(function(ok) {
            return ch.sendToQueue(q, new Buffer('something to do'));
          });
        }).then(function(conn) {
          return conn.createChannel();
        }).then(function(ch) {
          return ch.assertQueue(q).then(function(ok) {
            return ch.consume(q, function(msg) {
              if (msg !== null) {
                console.log(msg.content.toString());
                ch.ack(msg);
              }
            });
          });
        }).catch();
   }

 }

module.exports = new MessageService();
