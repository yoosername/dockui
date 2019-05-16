const EventEmitter = require("events");
const COMMIT_EVENT_ID = "task:committed";
const SUCCESS_EVENT_ID = "task:success";
const ERROR_EVENT_ID = "task:error";
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
    this.emit(COMMIT_EVENT_ID, this);
  }
}

Task.COMMIT_EVENT_ID = COMMIT_EVENT_ID;
Task.SUCCESS_EVENT_ID = SUCCESS_EVENT_ID;
Task.ERROR_EVENT_ID = ERROR_EVENT_ID;

module.exports = Task;
