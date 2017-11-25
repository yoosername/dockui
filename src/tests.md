# TOC
   - [DockerService](#dockerservice)
   - [EventService](#eventservice)
<a name=""></a>
 
<a name="dockerservice"></a>
# DockerService
should be defined and loadable.

```js
expect(DockerService).to.not.be.undefined;
```

should be a function.

```js
expect(DockerService).to.be.a('function');
```

should be able to be used with or without the new operator.

```js
var withNewOperator = new DockerService(new DockerClient(), new EventEmitter());
expect(withNewOperator).to.be.an.instanceOf(DockerService);
var withoutNewOperator = new DockerService(new DockerClient(), new EventEmitter());
expect(withoutNewOperator).to.be.an.instanceOf(DockerService);
```

should be called with an instance of DockerClient and an instance of EventEmitter or throw an error.

```js
expect(function(){DockerService();}).to.throw(Error, MISSING_CLIENT_ERROR);
expect(function(){DockerService(new DockerClient());}).to.throw(Error, MISSING_EMITTER_ERROR);
expect(function(){DockerService(new DockerClient(), new EventEmitter());}).to.not.throw();
```

should trigger container:start event for all containers detected on start.

```js
var emitter = new EventEmitter();
var mockDockerClient = new DockerClient();
var expectedContainerArray = mockDockerClient.containers;
emitter.on(CONTAINER_START_EVENT_ID, function(payload){
    expect(payload).to.eql(expectedContainerArray[0]);
    done();
});
var ds = new DockerService(mockDockerClient,emitter);
ds.start();
```

should throw an error if Docker is not running.

```js
var emitter = new EventEmitter();
var mockDockerClient = new DockerClient();
mockDockerClient.setIsDockerRunning(false);
var ds = new DockerService(mockDockerClient,emitter);
expect(ds.isDockerRunning()).to.equal(false);
expect(function(){ds.start();}).to.throw(Error, DOCKER_NOT_RUNNING_ERROR);
mockDockerClient.setIsDockerRunning(true);
expect(ds.isDockerRunning()).to.equal(true);
```

should not fire container:start for existing containers on subsequent starts.

```js
var emitter = new EventEmitter();
var count = 0;
emitter.on(CONTAINER_START_EVENT_ID, function(){
    count++;
});
var EXPECTED_COUNT = 5;
var mockDockerClient = new DockerClient(EXPECTED_COUNT);
var ds = new DockerService(mockDockerClient,emitter);
ds.start();
expect(count).to.equal(EXPECTED_COUNT);
ds.start();
expect(count).to.equal(EXPECTED_COUNT);
ds.start();
expect(count).to.equal(EXPECTED_COUNT);
```

should fire container:start when client detects new container.

```js
var emitter = new EventEmitter();
var EXPECTED_COUNT = 5;
var mockDockerClient = new DockerClient(EXPECTED_COUNT);
var ds = new DockerService(mockDockerClient,emitter);
var count = 0;
emitter.on(CONTAINER_START_EVENT_ID, function(){
    count++;
});
ds.start();
expect(count).to.equal(EXPECTED_COUNT);
var container = mockDockerClient.generateNewContainer();
emitter.on(CONTAINER_START_EVENT_ID, function(c){
    expect(count).to.equal(EXPECTED_COUNT + 1);
    expect(c).to.eql(container);
    done();
});
mockDockerClient.addRunningContainer(container);
```

<a name="eventservice"></a>
# EventService
should be defined and loadable.

```js
expect(EventService).to.not.be.undefined;
```

should be a function.

```js
expect(EventService).to.be.a('function');
```

should be able to be used with or without the new operator.

```js
var withNewOperator = new EventService();
expect(withNewOperator).to.be.an.instanceOf(EventService);
var withoutNewOperator = new EventService();
expect(withoutNewOperator).to.be.an.instanceOf(EventService);
```

should emit an event when trigger is called with the correct payload.

```js
const es = new EventService();
        const eventPayload = {
            action: "thing"
        };
        es.on("test:event", function(payload){
            expect(payload).to.eql(eventPayload);
            done();
        });
        es.emit("test:event", eventPayload);
```

