const EventEmitter = require('events');

/**
 * CacheService service
 */
 class CacheService extends EventEmitter{
   constructor() {
     super();
     this.cache = {};
   }

   add(path, template){
     this.cache[path] = {
       template: template
     };
   }

   get(path){

     // If timeout older than date remove it and return null
     var item = this.cache[path];

     if(!item){
       console.log("NOT CACHED: ", path);
       return null;
     }
     console.log("CACHED: ", path);
     return item;
   }

 }

module.exports = new CacheService();
