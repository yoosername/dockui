# Logger

> Encapsulates the ability to write log entries somewhere

```javascript
const logger = new Logger(); // optionally pass a config new Logger(new Config())

// Use like console.log()
logger.info("some string", {}, [], "bla")

// Produces something similar to (depending on the extended Loggers provided formatting)
>[Wed May 22 2019 11:37:51][INFO][SERVICE 1] some string {} [] bla

// Which is shorthand for
logger.log({
  level: 'info',
  message: ["some string", {}, [], "bla"]
});

// Also other shorthands
logger.error("...");
logger.warn("...");
logger.info("...");
logger.verbose("...");
logger.debug("...");
logger.silly("...");

// Create a child from the logger to change meta data
const serviceLogger = logger.child({name : "Service1"});
serviceLogger.info("some string", {}, [], "bla");

// Produces something similar to
>[Wed May 22 2019 11:37:51][INFO][Service1] some string {} [] bla
```
