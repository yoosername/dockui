/**
 * @description TaskManagerFactory has a single method .create which generates
 *              a TaskManager instance based on passed in Environment Context
 */
class TaskManagerFactory {
  constructor() {}

  /**
   * @async
   * @description Return new TaskManager based on passed in ctx
   * @argument {String} ctx The environment context to parse
   * @return {TaskManager} A instance of a TaskManager
   */
  create(ctx) {
    // TODO: Implement logic to return a specific type of manager based on env
    return new require("../impl/SingleNodeTaskManager");
  }
}

module.exports = TaskManagerFactory;
