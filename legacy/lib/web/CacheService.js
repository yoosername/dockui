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
       console.log("[CacheService] : Not Cached");
       return null;
     }
     console.log("[CacheService] : Cached : ", path);
     return item;
   }

 }

module.exports = new CacheService();
