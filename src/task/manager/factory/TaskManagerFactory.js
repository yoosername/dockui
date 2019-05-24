const SingleNodeTaskManager = require("../impl/SingleNodeTaskManager");
const { Config } = require("../../../config/Config");
const Logger = require("../../../log/Logger");

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
  create({ config = new Config(), logger = new Logger(config) } = {}) {
    let instance = null;
    let TaskManager = null;
    switch (config.get("taskManager.type")) {
      case "simple":
        TaskManager = SingleNodeTaskManager;
      default:
        TaskManager = SingleNodeTaskManager;
    }
    instance = new TaskManager({ config, logger });
    return instance;
  }
}
let factory;
factory = factory ? factory : new TaskManagerFactory();
module.exports = factory;
