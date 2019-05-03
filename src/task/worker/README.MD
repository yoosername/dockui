# TaskWorker

> TaskWorker subclasses register with a TaskManager to process specific request types and provide notification of Task lifecycle

### Example

```javascript
const factory = new TaskManagerFactory();
const manager = factory.create();
const worker = new AppLoaderTaskWorker(manager);
worker.start();
// Attaches to TaskManager and processes App Load tasks
worker.shutdown();
// No longer listening for tasks and disconnected from TaskManager.
```
