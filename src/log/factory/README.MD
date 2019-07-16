# LoggerFactory

> The LoggerFactory returns the correct Logger implementation based on data from the passed in Config

```javascript
const config = new Config();
config.set("logging.log.format","[${timestamp}][${level}][${name}]${...info}");
config.set("logging.service.name","dockui");
const logger = LoggerFactory.create(config);
logger.info("some string", {}, [], "bla")
// Produces something similar to
>[Wed May 22 2019 11:37:51][INFO][dockui] some string {} [] bla
```
