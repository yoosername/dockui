const EventEmitter = require("events");
const CREATED_STATUS = "created";
const COMMITTED_STATUS = "committed";
const IN_PROGRESS_STATUS = "inProgress";
const SUCCESSFUL_STATUS = "successful";
const FAILED_STATUS = "failed";
const COMMIT_EVENT = "task:committed";
const IN_PROGRESS_EVENT = "task:inProgress";
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
    this.setStatus(Task.status.CREATED);

    // Listen to events to update status
    this.on(Task.events.COMMIT_EVENT, () => {
      this.setStatus(Task.status.COMITTED);
    });
    this.on(Task.events.IN_PROGRESS_EVENT, () => {
      this.setStatus(Task.status.IN_PROGRESS);
    });
    this.on(Task.events.SUCCESS_EVENT, () => {
      this.setStatus(Task.status.SUCCESSFUL);
    });
    this.on(Task.events.ERROR_EVENT, () => {
      this.setStatus(Task.status.FAILED);
    });
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
   * @description Get current Task status
   */
  getStatus() {
    return this.status;
  }

  /**
   * @description Update current Task status
   */
  setStatus(status) {
    this.status = status;
  }

  /**
   * @description Helper to returns content as JSON
   */
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      timeout: this.timeout,
      delayUntil: this.delayUntil,
      payload: this.payload
    };
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
 * @description Represents common DockUI Task Status's
 */
Task.status = Object.freeze({
  CREATED: CREATED_STATUS,
  COMITTED: COMMITTED_STATUS,
  IN_PROGRESS: IN_PROGRESS_STATUS,
  SUCCESSFUL: SUCCESSFUL_STATUS,
  FAILED: FAILED_STATUS
});

/**
 * @static
 * @description Represents common DockUI Task Events
 */
Task.events = Object.freeze({
  COMMIT_EVENT: COMMIT_EVENT,
  IN_PROGRESS_EVENT: IN_PROGRESS_EVENT,
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
  APP_RELOAD: "APP_RELOAD",
  APP_ENABLE: "APP_ENABLE",
  APP_DISABLE: "APP_DISABLE",
  MODULE_ENABLE: "MODULE_ENABLE",
  MODULE_DISABLE: "MODULE_DISABLE"
});

module.exports = Task;
