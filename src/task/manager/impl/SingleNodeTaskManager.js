const TaskManager = require("../TaskManager");
const Task = require("../../Task");
const uuidv4 = require("uuid/v4");
const { Config } = require("../../../config/Config");

const QUEUE_PROCESSING_INTERVAL = 200;

/**
 * @description Default TaskManager single node, multi process DockUI instances
 */
class SingleNodeTaskManager extends TaskManager {
  constructor(config = new Config()) {
    super(config);
    this.queue = [];
    this.inProgressQueue = [];
    this.successQueue = [];
    this.failedQueue = [];
    this.workers = [];
    this.lastWorker = 0;
  }

  /**
   * @async
   * @description Commit a task for processing
   * @argument {Task} task The task to commit for processing
   */
  commit(task) {
    this.queue.push(task);
    this.emit(TaskManager.events.COMMIT_EVENT, task);
  }

  /**
   * @description Get all the queued (committed) tasks
   * @argument {Array} tasks The task that have been committed
   */
  getQueued() {
    return this.queue;
  }

  /**
   * @description Get all the in Progress tasks
   * @argument {Array} tasks The task that have been assigned to worker but not finished yet
   */
  getInProgress() {
    return this.inProgressQueue;
  }

  /**
   * @description Get all the successful tasks
   * @argument {Array} tasks The task that have been successful
   */
  getSuccessful() {
    return this.successQueue;
  }

  /**
   * @description Get all the failed tasks
   * @argument {Array} tasks The task that have failed
   */
  getFailed() {
    return this.failedQueue;
  }

  /**
   * @description Get registered workers
   * @argument {Array} workers Array of registered workers
   */
  getWorkers() {
    return this.workers;
  }

  /**
   * @async
   * @description Add a new Task to the Queue for processing
   * @argument {String} type The type of the task
   * @argument {Object} payload The payload of the task
   * @return {Promise} A Promise which should resolve with a new {Task} Object
   * @example
   *
   *  const taskManager = new SingleNodeTaskManager();
   *  const task = await taskManager.create( "app:enable", { id: "f4c33dda-46ca33dd-44c3a3ed-4acc33de"});
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
    return new Promise((resolve, reject) => {
      const task = new Task(type, payload);
      task.on(Task.events.COMMIT_EVENT, () => {
        this.commit(task);
      });
      resolve(task);
    });
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
    return new Promise((resolve, reject) => {
      const worker = {
        id: uuidv4(),
        type: type,
        working: false,
        process: callback
      };
      this.workers.push(worker);
      resolve(worker);
    });
  }

  /**
   * @description Grab Task from queue, add to inProgress and return
   * @argument {Object} worker The worker which wants to proces the task
   */
  getNextQueuedTask(worker) {
    const task = this.getQueued().shift();
    this.inProgressQueue.push(task);
    return task;
  }

  /**
   * @description Move Task from InProgress queue to successfull queue
   */
  inProgressToSuccessful(task) {
    // pop task out of inProgress queue
    // add it to the successul queue
  }

  /**
   * @description Move Task from InProgress queue to error queue
   */
  inProgressToFailed(task) {
    // pop task out of inProgress queue
    // add it to the failed queue
  }

  /**
   * @description Process the current queue
   */
  processQueue() {
    if (this.getWorkers().length > 0) {
      if (this.getQueued().length > 0) {
        this.getWorkers().forEach(worker => {
          if (!worker.working) {
            const task = this.getNextQueuedTask(worker);
            task.on(Task.SUCCESS_EVENT_ID, response => {
              worker.working = false;
              this.inProgressToSuccessful(task);
            });
            task.on(Task.ERROR_EVENT_ID, response => {
              worker.working = false;
              this.inProgressToFailed(task);
            });
            worker.working = true;
            worker.process(task);
          }
        });
      }
    }
  }

  /**
   * @async
   * @description Start Processing Tasks
   * @return {Promise} A Promise which should resolve once everything has been started successfully
   */
  async start() {
    // Set timeout and process jobs in the queue every second
    // Using Workers in the workers array that can handle the type
    return new Promise((resolve, reject) => {
      this.running = setInterval(
        this.processQueue.bind(this),
        QUEUE_PROCESSING_INTERVAL
      );
      resolve();
    });
  }

  /**
   * @async
   * @description Shutdown down any network connections etc
   * @return {Promise} A Promise which should resolve once everything has been shutdown gracefully
   */
  async shutdown() {
    return new Promise((resolve, reject) => {
      clearInterval(this.running);
      resolve();
    });
  }
}

module.exports = SingleNodeTaskManager;
