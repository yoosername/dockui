/**
 * @description TaskManager handles:
 *                           - Task queueing, retries, handling failures
 *                           - Worker creation
 *                           - Distribution of Tasks to Workers
 *                           - Leadership Election amongst Workers
 *                           - Worker notification / events
 */
class TaskManager {
  constructor() {}

  /**
   * @async
   * @description Add a new Task to the Queue for processing
   * @argument {String} type The type of the task
   * @argument {Object} config The Config specific to the task
   * @return {Promise} A Promise which should resolve with a new {Task} Object
   * @example
   *
   *  const taskManager = new DefaultTaskManager();
   *  const task = await taskManager.createTask("app:enable", { id: "f4c33dda-46ca33dd-44c3a3ed-4acc33de"});
   *  task
   *    .withTimeout(10000)
   *    .withDelayUntil(Date.parse('2020-01-01'))
   *    .on("success", (result)=>{
   *      console.log(`Task with id ${task.id} completed successfully`);
   *    })
   *    .commit();
   */
  async createTask(type, config) {
    console.warn(
      "[TaskManager] createTask - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @async
   * @description Register as a Worker to process Jobs ( Can only register once per process )
   * @argument {Function} callback The code to run when a Job has been assigned to this Worker
   *                               This callback function should be an async function
   * @return {Promise} A Promise which should resolve with a fresh {Worker} object
   * @example
   *
   *  const taskManager = new DefaultTaskManager();
   *  const worker = await taskManager.processTasks( async (job)={
   *    console.log(`Worker with ID ${worker.id} (${worker.isMaster()}), received Job ${job.id} for processing`);
   *    return true;
   *  });
   */
  async processTasks(callback) {
    console.warn(
      "[TaskManager] processTasks - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @async
   * @description Start Processing Tasks
   * @return {Promise} A Promise which should resolve once everything has been started successfully
   */
  async start() {
    console.warn(
      "[TaskManager] start - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @async
   * @description Shutdown down any network connections etc
   * @return {Promise} A Promise which should resolve once everything has been shutdown gracefully
   */
  async shutdown() {
    console.warn(
      "[TaskManager] shutdown - NoOp implementation - this should be extended by child classes"
    );
  }
}

module.exports = TaskManager;
