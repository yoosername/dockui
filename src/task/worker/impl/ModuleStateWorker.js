const Module = require("../../../app/module/Module");
const Task = require("../../Task");
const TaskWorker = require("../TaskWorker");
const { Config } = require("../../../config/Config");
const Logger = require("../../../log/Logger");

/**
 * @description Worker which responds to Module enable/disable tasks
 *              1: Save new Module state to Store
 *              2: Close Task as success
 */
class ModuleStateWorker extends TaskWorker {
  /**
   * @argument {TaskManager} taskManager The taskManager this worker should register with for new tasks
   * @argument {AppStore} store The store to use for persisting any data
   * @argument {Config} config Optional Runtime config
   */
  constructor({
    taskManager,
    store,
    config = new Config(),
    logger = new Logger(config)
  } = {}) {
    super(...arguments);
    this.taskManager = taskManager;
    this.worker1 = null;
    this.worker2 = null;
    this.store = store;
    this.config = config;
    this.logger = logger.child({
      config: { "service.name": "ModuleStateWorker" }
    });
    this._running = false;
  }

  /**
   * @description Return the taskManager we are using
   */
  getTaskManager() {
    "use strict";
    return this.taskManager;
  }

  /**
   * @description Return the Store we are using
   */
  getStore() {
    "use strict";
    return this.store;
  }

  /**
   * @description Return the Config we are using
   */
  getConfig() {
    "use strict";
    return this.config;
  }

  /**
   * @description Are we currently running
   */
  isRunning() {
    "use strict";
    return this._running;
  }

  /**
   * @description Process a Single Task when called by the taskManager
   * @argument {Task} task The task to be processed
   */
  processTask(task, worker) {
    "use strict";
    return new Promise(async (resolve, reject) => {
      const payload = task.getPayload();
      const module = payload && payload.module ? payload.module : null;
      this.logger.info(
        "Worker (id=%s) is processing Task(id=%s) with payload(%o)",
        worker.id,
        task.getId(),
        payload
      );

      // Make sure there is a URL to load
      if (!module) {
        let errMsg = `Task with id(${task.getId()}) is missing a module in the payload`;
        task.emit(Task.events.ERROR_EVENT, errMsg);
        return reject(new Error(errMsg));
      }
      // Toggle disable or enable based on payload
      const moduleData = module.toJSON();
      moduleData.enabled =
        task.getType() === Task.types.MODULE_DISABLE ? false : true;
      const updatedModule = new Module(moduleData);
      const appId = updatedModule.getAppId();
      const appData = await this.store.read(appId);
      if (appData) {
        appData.modules = appData.modules.map((cur, idx, arr) => {
          return cur.id === updatedModule.getId()
            ? updatedModule.toJSON()
            : cur;
        });
        await this.store.update(appData.id, appData);
      }

      // Save it to the Store
      await this.store.update(moduleData.id, updatedModule);

      // Close off the task
      task.emit(Task.events.SUCCESS_EVENT, updatedModule);
      resolve();
    });
  }

  /**
   * @description initialize and start Worker
   */
  start() {
    "use strict";
    if (this.isRunning()) {
      return Promise.resolve();
    }
    this._running = true;
    return new Promise(async (resolve, reject) => {
      const taskManager = this.taskManager;
      // Register an Enable Worker
      try {
        this.worker1 = await taskManager.process(
          Task.types.MODULE_ENABLE,
          async task => {
            await this.processTask(task, this.worker1);
          }
        );
        this.logger.info(
          "TaskWorker (ModuleEnable) [%s] has started and is ready to process tasks",
          this.worker1.id
        );
      } catch (err) {
        this.logger.error("TaskWorker (ModuleEnable) failed to start %o", err);
        reject();
      }
      // Register a Disable Worker
      try {
        this.worker2 = await taskManager.process(
          Task.types.MODULE_DISABLE,
          async task => {
            await this.processTask(task, this.worker2);
          }
        );
        this.logger.info(
          "TaskWorker (ModuleDisable) [%s] has started and is ready to process tasks",
          this.worker2.id
        );
      } catch (err) {
        this.logger.error("TaskWorker (ModuleDisable) failed to start %o", err);
        reject();
      }
      resolve();
    });
  }

  /**
   * @description Gracefully shutdown Worker
   */
  shutdown() {
    "use strict";
    if (!this.isRunning()) {
      return Promise.resolve();
    }
    return new Promise(async (resolve, reject) => {
      if (this.worker1 && this.worker1.close) {
        await this.worker1.close();
      }
      this.worker1 = null;
      if (this.worker2 && this.worker2.close) {
        await this.worker2.close();
      }
      this.worker2 = null;
      this._running = false;
      resolve();
    });
  }
}

module.exports = ModuleStateWorker;