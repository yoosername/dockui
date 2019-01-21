# EventService

> An EventService is used to distribute and listen for events.

## API

### addEventListener(event,fn)

Add a handler function for a specific event. Handler receives the event payload which contains:

```json
   {type : "eventType", data: "data specific to the event type"}
```

### removeEventListener(event,fn)

Remove a hanlder function from responding to specific events

### on(event,fn)

Convenience method for addEventListener. Does the same thing as

```javascript
addEventListener(event,fn);
```

### emit(event,payload)

Notify listeners of a particular event ( with optional payload )

```getApps(app => app.getKey() === key);```