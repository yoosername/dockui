# TOC
   - [EventService](#eventservice)
   - [DockUIPlugins](#dockuiplugins)
   - [DockUIPluginsBuilder](#dockuipluginsbuilder)
   - [Store](#store)
<a name=""></a>
 
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

should emit an event when emit() is called with the correct payload.

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

<a name="dockuiplugins"></a>
# DockUIPlugins
should be defined and loadable.

```js
expect(DockUIPlugins).to.not.be.undefined;
```

should be a function.

```js
expect(DockUIPlugins).to.be.a('function');
```

Should return a DockUIPlugins.Builder if one isnt passed as arg.

```js
var builder = new DockUIPlugins();
expect(builder).to.be.instanceof(DockUIPluginsBuilder);
```

should start pluginService.start method when start() called.

```js
var pluginService = sinon.mock(mockPluginService);
pluginService.expects("start").once();

var dockUIPlugins = new DockUIPluginsBuilder()
  .withStore(mockStore)
  .withEventService(mockEventService)
  .withPluginService(mockPluginService)
  .withWebService(mockWebService)
  .build();
dockUIPlugins.start();
pluginService.verify();
```

should call pluginService.stop method when stop() called.

```js
var webService = sinon.mock(mockWebService);
webService.expects("shutdown").once();

var dockUIPlugins = new DockUIPluginsBuilder()
  .withStore(mockStore)
  .withEventService(mockEventService)
  .withPluginService(mockPluginService)
  .withWebService(mockWebService)
  .build();
dockUIPlugins.shutdown();
webService.verify();
```

<a name="dockuipluginsbuilder"></a>
# DockUIPluginsBuilder
should be able to set the Store.

```js
new DockUIPluginsBuilder().withStore(mockStore);
```

should be able to set the EventService.

```js
new DockUIPluginsBuilder().withEventService(mockEventService);
```

should be able to set the PluginService.

```js
new DockUIPluginsBuilder().withPluginService(mockPluginService);
```

should be able to set the WebService.

```js
new DockUIPluginsBuilder().withWebService(mockWebService);
```

should return a DockUIPlugins instance when build is called.

```js
const dockuiPluginsInstance = new DockUIPluginsBuilder()
  .withStore(mockStore)
  .withEventService(mockEventService)
  .withPluginService(mockPluginService)
  .withWebService(mockWebService)
  .build();
expect(dockuiPluginsInstance).to.be.an.instanceOf(DockUIPlugins);
```

should validate when build is called.

```js
expect(function(){
  new DockUIPluginsBuilder()
    .withEventService(mockEventService)
    .withPluginService(mockPluginService)
    .withWebService(mockWebService)
    .build();
}).to.throw(MissingStoreDuringSetupError);  
expect(function(){
  new DockUIPluginsBuilder()
    .withStore(mockStore)
    .withPluginService(mockPluginService)
    .withWebService(mockWebService)
    .build();
}).to.throw(MissingEventServiceDuringSetupError);  
expect(function(){
  new DockUIPluginsBuilder()
    .withStore(mockStore)
    .withEventService(mockEventService)
    .withWebService(mockWebService)
    .build();
}).to.throw(MissingPluginServiceDuringSetupError);  
expect(function(){
  new DockUIPluginsBuilder()
    .withStore(mockStore)
    .withEventService(mockEventService)
    .withPluginService(mockPluginService)
    .build();
}).to.throw(MissingWebServiceDuringSetupError);
```

<a name="store"></a>
# Store
should be defined and loadable.

```js
expect(Store).to.not.be.undefined;
```

should be a function.

```js
expect(Store).to.be.a('function');
```

