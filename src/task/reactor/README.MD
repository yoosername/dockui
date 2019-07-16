# Reactor

> A Reactor listens to external events and potentially generates Tasks via the TaskManager

### Example

```javascript
const factory = new TaskManagerFactory();
const manager = factory.create();
const reactor = new DockerEventsReactor(manager);
reactor.start();
// Listenes for events and uses TaskManager to create tasks
reactor.shutdown();
// No longer listening for events.
```
