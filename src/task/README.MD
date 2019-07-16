# Task

> Task represents a single Task to be queued by a TaskManager and processed by a TaskWorker

### Example

```javascript
const task = new Task("type", { "some", "payload" });
task.on("task:committed", ()=>{
    console.log(`Task with id ${task.getId()} has been committed`);
});
task
    .withTimeout(10000); // wait 10 seconds before failing the Job
    .withDelayUntil(Date.parse('2020-01-01'));// delay this job until the specific Date
    .on("success", (result)=>{ // handle a successfull Task
        console.log(`Task with id ${task.id} completed successfully`);
    });
    .on("failure", (error)=>{
        console.log(`Task with id ${task.id} failed with error ${error}`);
    });
    .commit(); // Commit this task ( TaskManager will queues it at this point )
```
