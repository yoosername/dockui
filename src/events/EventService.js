/**
 * @description Simple native events service
 */
class EventService {
  constructor() {}

  /**
   * @description helper for adding an event listener
   * @argument {String} event - The Event
   * @argument {Function} fn - The callback to run when the event is emmited
   */
  on(event, fn) {
    console.warn(
      "[EventsService] on - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Add an event listener
   * @argument {String} event - The Event
   * @argument {Function} fn - The callback to run when the event is emmited
   */
  addEventListener(event, fn) {
    console.warn(
      "[EventsService] addEventListener - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Remove an event listener
   * @argument {String} event - The Event
   * @argument {Function} fn - The callback to remove
   */
  removeEventListener(event, fn) {
    console.warn(
      "[EventsService] removeEventListener - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Trigger an event with optional payload
   * @argument {String} event - The Event id
   * @argument {Object} payload - The payload of the event
   */
  emit(event, payload) {
    console.warn(
      "[EventsService] emit - NoOp implementation - this should be extended by child classes"
    );
  }
}

module.exports = EventService;
