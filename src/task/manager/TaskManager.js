const EventEmitter = require("events");
const TASKMANAGER_STARTED_EVENT = "taskManager:started";
const TASKMANAGER_SHUTDOWN_EVENT = "taskManager:shutdown";
const COMMIT_EVENT = "task:committed";

/**
 * @description TaskManager handles:
 *                           - Task queueing, retries, handling failures
 *                           - Worker creation
 *                           - Distribution of Tasks to Workers
 *                           - Leadership Election amongst Workers
 *                           - Worker notification / events
 */
class TaskManager extends EventEmitter {
  constructor() {
    super();
  }

  /**
   * @async
   * @description Add a new Task to the Queue for processing
   * @argument {String} type The type of the task
   * @argument {Object} payload The payload of the task
   * @return {Promise} A Promise which should resolve with a new {Task} Object
   * @example
   *
   *  const taskManager = new DefaultTaskManager();
   *  const task = await manager.create( "app:enable", { id: "f4c33dda-46ca33dd-44c3a3ed-4acc33de"});
   *  task
   *    .withTimeout(10000); // wait 10 seconds before failing the Job
   *    .withDelayUntil(Date.parse('2020-01-01'));// delay this job until the specific Date
   *    .on("success", (result)=>{ // handle a successfull Task
   *      console.log(`Task with id ${task.id} completed successfully`);
   *    });
   *    .on("failure", (error)=>{
   *      console.log(`Task with id ${task.id} failed with error ${error}`);
   *    });
   *    .commit(); // Commit this task ( Queues it )
   */
  async create(type, payload) {
    console.warn(
      "[TaskManager] create - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @async
   * @description Register as a Worker to process Jobs ( Can only register once per process )
   * @argument {String} type The type of tasks to register for (optional)
   * @argument {Function} callback The code to run when a Job has been assigned to this Worker
   *                               This callback function will receive a Task object and can use
   *                               The events on the object to notify status
   * @return {Promise} A Promise which should resolve with a fresh {Worker} object
   * @example
   *
   *  const manager = TaskManagerFactory.create();
   *  const worker = await manager.process( "app:enable", async (task)={
   *      console.log(`Worker with ID ${worker.id} received Task with ID ${task.id}`);
   *      return true;
   *  });
   */
  async process(type, callback) {
    console.warn(
      "[TaskManager] processTasks - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Return all tasks processed by this Manager
   * @argument {String} type Optional filter for list of tasks
   * @return {Object} An object containing tasks keyed on respective queue.
   */
  getTasks(type) {
    console.warn(
      "[TaskManager] getTasks - NoOp implementation - this should be extended by child classes"
    );
  }

  /**
   * @description Return single taskby its ID
   * @argument {String} id Id of the task to find
   * @return {Task} The Task matching the ID
   */
  getTask(id) {
    console.warn(
      "[TaskManager] getTask - NoOp implementation - this should be extended by child classes"
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

/**
 * @static
 * @description Represents common DockUI Task Events
 */
TaskManager.events = Object.freeze({
  TASKMANAGER_STARTED_EVENT: TASKMANAGER_STARTED_EVENT,
  TASKMANAGER_SHUTDOWN_EVENT: TASKMANAGER_SHUTDOWN_EVENT,
  COMMIT_EVENT: COMMIT_EVENT
});

module.exports = TaskManager;
