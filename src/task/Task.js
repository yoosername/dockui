const EventEmitter = require("events");
const COMMIT_EVENT = "task:committed";
const SUCCESS_EVENT = "task:success";
const ERROR_EVENT = "task:error";
const uuidv4 = require("uuid/v4");

/**
 * @description TaskWorkers listen to TaskManager queue for certain types of task
 *              and process them when requested
 */
class Task extends EventEmitter {
  constructor(type = "default", payload = {}) {
    super();
    this.id = uuidv4();
    this.type = type;
    this.timeout = 0;
    this.delayUntil = new Date();
    this.payload = payload;
  }

  /**
   * @description initialize and start TaskWorker
   */
  withTimeout(timeoutMS) {
    this.timeout = timeoutMS;
    return this;
  }

  /**
   * @description initialize and start TaskWorker
   */
  withDelayUntil(delayUntilDate) {
    this.delayUntil = delayUntilDate;
    return this;
  }

  /**
   * @description Return Task Id
   */
  getId() {
    return this.id;
  }

  /**
   * @description Return type
   */
  getType() {
    return this.type;
  }

  /**
   * @description Return payload
   */
  getPayload() {
    return this.payload;
  }

  /**
   * @description Return Timeout
   */
  getTimeout() {
    return this.timeout;
  }

  /**
   * @description Return delayUntil
   */
  getDelayUntil() {
    return this.delayUntil;
  }

  /**
   * @description Helper to trigger commit event
   */
  commit() {
    this.emit(Task.events.COMMIT_EVENT, this);
  }
}

/**
 * @static
 * @description Represents common DockUI Task Events
 */
Task.events = Object.freeze({
  COMMIT_EVENT: COMMIT_EVENT,
  SUCCESS_EVENT: SUCCESS_EVENT,
  ERROR_EVENT: ERROR_EVENT
});

/**
 * @static
 * @description Represents common DockUI Task Types
 */
Task.types = Object.freeze({
  APP_LOAD: "APP_LOAD",
  APP_UNLOAD: "APP_UNLOAD",
  APP_ENABLE: "APP_ENABLE",
  APP_DISABLE: "APP_DISABLE"
});

module.exports = Task;
