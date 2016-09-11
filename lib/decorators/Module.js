const EventEmitter = require('events');

class Module extends EventEmitter{
  constructor(descriptor) {
    this.key = descriptor.key;
    this.name = descriptor.name || descriptor.key;
  }

  getLink(){
    return this.link;
  }

  setLink(link){
    this.link = link;
  }
}

module.exports = Module;
