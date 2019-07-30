const TaskManager = require("../TaskManager");
const Task = require("../../Task");
const uuidv4 = require("uuid/v4");
const { Config } = require("../../../config/Config");
const Logger = require("../../../log/Logger");

const TASK_PROCESSING_INTERVAL = 500;

/**
 * @description Default TaskManager single node, multi process DockUI instances
 */
class SingleNodeTaskManager extends TaskManager {
  constructor({ config = new Config(), logger = new Logger(config) } = {}) {
    super(...arguments);
    this.config = config;
    this.logger = logger.child({ config: { "service.name": "TaskManager" } });
    this.queue = [];
    this.inProgressQueue = [];
    this.successQueue = [];
    this.failedQueue = [];
    this.workers = {};
    this.lastWorker = 0;
  }

  /**
   * @async
   * @description Commit a task for processing
   * @argument {Task} task The task to commit for processing
   */
  commit(task) {
    this.logger.debug("Committed task with id %s", task.getId());
    this.queue.push(task);
    this.emit(TaskManager.events.COMMIT_EVENT, task);
  }

  /**
   * @description Conveniance wrapper for showing tasks by status
   * @return {Object} The tasks keyed on their respective queue
   */
  getTasks(type) {
    let tasks = {
      queue: this.getQueued(),
      inProgress: this.getInProgress(),
      successful: this.getSuccessful(),
      failed: this.getFailed()
    };
    if (type) {
      return { [type]: tasks[type] };
    }
    return tasks;
  }

  /**
   * @description Return single taskby its ID
   * @argument {String} id Id of the task to find
   * @return {Task} The Task matching the ID
   */
  getTask(id) {
    let filteredTasks = []
      .concat([
        ...this.getQueued(),
        ...this.getInProgress(),
        ...this.getSuccessful(),
        ...this.getFailed()
      ])
      .filter(task => {
        return task.id === id;
      });
    return filteredTasks[0];
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
   * @argument {Object|Array} workers Array of registered workers
   */
  getWorkers(type) {
    if (type) return this.workers[type];
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
      task.on(Task.events.COMMIT_EVENT, task => {
        this.commit(task);
      });
      this.logger.debug(
        "Generated new task of type=%s, wont process until it has been comitted",
        type
      );
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
    return new Promise(async (resolve, reject) => {
      const id = uuidv4();
      const worker = {
        id: id,
        type: type,
        working: false,
        process: async args => {
          this.working = true;
          await callback(args);
          this.working = false;
        },
        close: () => {
          try {
            this.workers[type] = this.workers[type].filter(w => w.id !== id);
          } catch (e) {}
        }
      };
      if (!this.workers[type]) this.workers[type] = [];
      this.workers[type].push(worker);
      this.logger.debug(
        "Registered worker with id=%s for tasks of type=%s",
        id,
        type
      );
      resolve(worker);
    });
  }

  /**
   * @description Move Task from InProgress queue to successful queue
   */
  queueToInProgress(task) {
    // pop task out of inProgress queue
    this.queue = this.queue.filter((value, index, array) => {
      return value !== task;
    });
    // add it to the in progress queue
    this.inProgressQueue.push(task);
    // Update task status
    task.emit(Task.events.IN_PROGRESS_EVENT);
    this.logger.debug(
      "Promoted task with id %s, from queue to in progress",
      task.getId()
    );
  }

  /**
   * @description Move Task from InProgress queue to successful queue
   */
  inProgressToSuccessful(task) {
    // pop task out of inProgress queue
    this.inProgressQueue = this.inProgressQueue.filter(
      (value, index, array) => {
        return value !== task;
      }
    );
    // add it to the successul queue
    this.successQueue.push(task);
    this.logger.debug(
      "Promoted task with id %s, from in progress to successful",
      task.getId()
    );
  }

  /**
   * @description Move Task from InProgress queue to error queue
   */
  inProgressToFailed(task) {
    // pop task out of inProgress queue
    this.inProgressQueue = this.inProgressQueue.filter(
      (value, index, array) => {
        return value !== task;
      }
    );
    // add it to the failed queue
    this.failedQueue.push(task);
    this.logger.debug(
      "Promoted task with id %s, from in progress to failed",
      task.getId()
    );
  }

  /**
   * @description Process the current queue
   */
  async processQueue(task) {
    this.logger.verbose(
      "Checking if worker available to process task of type ",
      task.type
    );
    let intervalId = setInterval(async () => {
      const workers = this.workers[task.type];
      for (var w in workers) {
        const worker = workers[w];
        if (worker && worker.type === task.type && !worker.working) {
          // clear the interval as we found a worker for this task now
          clearInterval(intervalId);
          this.logger.debug(
            "Worker(%s) has started work on Task(id=%s)",
            worker.id,
            task.id
          );
          // Promote to In Progress
          this.queueToInProgress(task);
          // Add some hooks for success/fail completion
          task.on(Task.events.SUCCESS_EVENT, response => {
            this.inProgressToSuccessful(task);
          });
          task.on(Task.events.ERROR_EVENT, err => {
            this.inProgressToFailed(task);
          });
          // Then actually try to run the associated task
          try {
            // Call the actual worker callback passing in the Task
            await worker.process(task);
          } catch (e) {
            // Log unknown errors
            this.logger.debug(
              "Worker (id=%s) failed to process Task(id=%s) : %o",
              worker.id,
              task.id,
              e
            );
          }
        }
      }
    }, TASK_PROCESSING_INTERVAL);
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
      // this.running = setInterval(
      //   this.processQueue.bind(this),
      //   QUEUE_PROCESSING_INTERVAL
      // );
      this.on(TaskManager.events.COMMIT_EVENT, async task => {
        await this.processQueue(task);
      });
      this.logger.info("Task Manager has started");
      this.emit(TaskManager.events.TASKMANAGER_STARTED_EVENT);
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
      this.logger.info("Task Manager has shutdown");
      this.emit(TaskManager.events.TASKMANAGER_SHUTDOWN_EVENT);
      resolve();
    });
  }
}

module.exports = SingleNodeTaskManager;
