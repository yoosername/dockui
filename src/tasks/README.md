# TaskManager

> A TaskManager instance is responsible for handling all asyncronous tasks across one or more nodes handling:

- Leadership Election if part of a Cluster
- Creating and Queuing a New Task ( With optional delay ) for a Worker to Pickup
- Checking the processing queue for stalled Tasks and optionally requeueing
- Moving Failed Tasks to a failed queue and handling notifications
- Handling notifications for queued,started,updated,failed,completed tasks.

Generally following the Reliable Queue Pattern here: https://redis.io/commands/rpoplpush#pattern-reliable-queue

## Leadership

A Single TaskManager at any given time is the Master and all participating TaskManagers use an algorithm to decide which process it is at any given time.

Any TaskManager can add tasks and any Worker can work on them, but only the Leader can assign tasks to workers at any given time and track the retries and failures as well as distribute results and notifications etc.

## Usage

```javascript
const manager = new DefaultTaskManager();
const worker = await manager.process( async (task)={
    console.log(`Worker with ID ${worker.id} (Master:${manager.isMaster()}) received Task with ID ${task.id}`);
    return true;
});
const task = await manager.create({
    "TaskSpecificKey" : "TaskSpecificValue"
});

// Tell the Worker to wait 10 seconds before failing the Job
task.withTimeout(10000);

// Optionally delay this job until the specific Date
task.withDelayUntil(Date.parse('2020-01-01'));

// Optionally handle a successfully resolved Task ( receives result )
task.on("success", (result)=>{

});

// Optionally handle a failed Task ( receives error )
task.on("failure", (result)=>{

});

// Commit this task ( Queues it )
task.commit();

// Hook to gracefully shutdown TaskManager and associated Workers
process.on("SIGTERM", () => {
    await manager.shutdown();
    process.exit(0);
});
```

## Worker

> A Worker is simply any process which uses a common TaskManager (or multiple TaskManagers connected via PubSub)
