const SingleNodeTaskManager = require("../impl/SingleNodeTaskManager");
const { Config } = require("../../../config/Config");

/**
 * @description TaskManagerFactory has a single method .create which generates
 *              a TaskManager instance based on passed in Config
 */
class TaskManagerFactory {
  constructor() {}

  /**
   * @async
   * @description Return new TaskManager based on passed in config
   * @argument {Config} config The runtime config
   * @return {TaskManager} A instance of a TaskManager
   */
  create({ config = new Config() } = {}) {
    let taskManager = null;
    switch (config.get("store.type")) {
      case "":
        taskManager = new SingleNodeTaskManager({ config });
      default:
        taskManager = new SingleNodeTaskManager({ config });
    }
    return taskManager;
  }
}
let factory;
factory = factory ? factory : new TaskManagerFactory();
module.exports = factory;
