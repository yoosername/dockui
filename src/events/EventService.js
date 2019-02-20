const EventEmitter = require("events");

/**
 * @description Simple native events service
 */
class EventsService {
  constructor() {
    this.emitter = new EventEmitter();
  }

  /**
   * @description helper for adding an event listener
   * @argument {String} event - The Event
   * @argument {Function} fn - The callback to run when the event is emmited
   */
  on(event, fn) {
    this.addEventListener(event, fn);
  }

  /**
   * @description Add an event listener
   * @argument {String} event - The Event
   * @argument {Function} fn - The callback to run when the event is emmited
   */
  addEventListener(event, fn) {
    this.emitter.addListener(event, fn);
  }

  /**
   * @description Remove an event listener
   * @argument {String} event - The Event
   * @argument {Function} fn - The callback to remove
   */
  removeEventListener(event, fn) {
    this.emitter.removeListener(event, fn);
  }

  /**
   * @description Trigger an event with optional payload
   * @argument {String} event - The Event id
   * @argument {Object} payload - The payload of the event
   */
  emit(event, payload) {
    this.emitter.emit(event, payload);
  }
}

module.exports = EventsService;
