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
   * @argument {Object} config The Task Config
   * @return {Promise} A Promise which should resolve with a new {Task} Object
   */
  create(config) {
    console.warn(
      "[TaskManager] create - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @async
   * @description Register as a Worker to process Jobs ( Can only register once per process )
   * @argument {Function} callback The code to run when a Job has been assigned to this Worker
   *                               This callback function should be an async function
   * @return {Promise} A Promise which should resolve with a fresh {Worker} object
   * @example
   *  const worker = await taskManager.process( async (job)={
   *    console.log(`Worker with ID ${worker.id} (${worker.isMaster()}), received Job ${job.id} for processing`);
   *    return true;
   *  });
   */
  process(config) {
    console.warn(
      "[TaskManager] process - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @async
   * @description Hook to allow implementations to shutdown down any network connections etc
   * @return {Promise} A Promise which should resolve once everything has been shutdown gracefully
   */
  shutdown() {
    console.warn(
      "[TaskManager] shutdown - NoOp implementation - this should be extended by child classes"
    );
  }
}

module.exports = TaskManager;
