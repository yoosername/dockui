/**
 * @description TaskManagerFactory has a single method .create which generates
 *              an TaskManager instance based on passed in Config
 */
class TaskManagerFactory {
  constructor() {}

  /**
   * @async
   * @description Return new TaskManager based on passed in config
   * @argument {Config} config The runtime config
   * @return {TaskManager} A instance of a TaskManager
   */
  create(config) {
    // TODO: Load the correct TaskManager implementation based on passed in Config
    // const taskManager = null;
    // switch( config.get("taskManager.type") ){
    //    case "" : taskManager = new SimpleTaskManager(config);
    //    case "clustered" : taskManager = new ClusteredTaskManager(config);
    //    default : taskManager = new SimpleTaskManager(config);
    // }
    // return taskManager;
  }
}
let factory = factory ? factory : new TaskManagerFactory();
module.exports = factory;
