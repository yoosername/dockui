const EventEmitter = require('events');

/**
 * @class EventService
 * @description Simple native events service
 */
class EventsService {

    constructor(){
      this.emitter = new EventEmitter();
    }

    on(event, fn){
      this.addEventListener(event, fn);
    }

    addEventListener(event, fn){
      this.emitter.addListener(event, fn);
    }

    removeEventListener(event, fn){
      this.emitter.removeListener(event, fn);
    }

    emit(event, payload){
      this.emitter.emit(event, payload);
    }

}

module.exports = EventsService;