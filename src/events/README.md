# EventService

> An EventService is used to distribute and listen for events.

## API

### addListener(event,fn)

Add a handler function for a specific event. Handler receives the event payload which contains:

```json
{ "type": "eventType", "data": "data specific to the event type" }
```

### removeListener(event,fn)

Remove a hanlder function from responding to specific events

### on(event,fn)

Convenience method for addListener. Does the same thing as

```javascript
addListener(event, fn);
```

### emit(event,payload)

Notify listeners of a particular event ( with optional payload )

`getApps(app => app.getKey() === key);`
