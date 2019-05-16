# TaskManager

> A TaskManager instance is responsible for handling:

- Creating and Queuing a New Task ( With optional delay )
- Ability for TaskWorker to register for handling certain tasks
- Checking the processing queue for stalled Tasks and optionally requeueing
- Moving Failed Tasks to a failed queue and handling notifications
- Handling lifecycle notifications for queued,started,updated,failed,completed tasks.

Generally following the Reliable Queue Pattern here: https://redis.io/commands/rpoplpush#pattern-reliable-queue

## Example

```javascript
const manager = TaskManagerFactory.create();
const worker = await manager.process( "queue", async (task)={
    console.log(`Worker with ID ${worker.id} (Master:${manager.isMaster()}) received Task with ID ${task.id}`);
    return true;
});
const task = await manager.create( "queue", {
    "TaskSpecificPayloadKey" : "TaskSpecificPayloadValue"
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
