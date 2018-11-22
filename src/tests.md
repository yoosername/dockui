# TOC
   - [EventService](#eventservice)
   - [LifecycleEventsStrategy](#lifecycleeventsstrategy)
   - [DockUIPlugins](#dockuiplugins)
   - [DockUIPluginsBuilder](#dockuipluginsbuilder)
   - [Plugin](#plugin)
   - [PluginService](#pluginservice)
   - [PluginStore](#pluginstore)
   - [WebService](#webservice)
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

<a name="lifecycleeventsstrategy"></a>
# LifecycleEventsStrategy
should be defined and loadable.

```js
expect(LifecycleEventsStrategy).to.not.be.undefined;
```

should be a function.

```js
expect(LifecycleEventsStrategy).to.be.a('function');
```

should throw if incorrect or missing args.

```js
expect(function(){
    new LifecycleEventsStrategy();
}).to.throw();
expect(function(){
    new LifecycleEventsStrategy("","","");
}).to.throw();
expect(function(){
    new LifecycleEventsStrategy(null,null,null);
}).to.throw();
expect(function(){
    new LifecycleEventsStrategy(undefined,undefined,undefined);
}).to.throw();
expect(function(){
    new LifecycleEventsStrategy({},{},{});
}).to.throw();
expect(function(){
    new LifecycleEventsStrategy({
        get: {}, set: {}
    },{},{});
}).to.throw();
expect(function(){
    new LifecycleEventsStrategy(
        mockPluginService,
        mockEventService,
        mockPluginStore
    );
}).to.not.throw();
```

should attach and detach 3 events listeners on setup and teardown.

```js
var eventsSpy = sinon.spy(mockEventService,"on");

var lifecycleEventsStrategy = new LifecycleEventsStrategy(
    mockPluginService,
    mockEventService,
    mockPluginStore
);
lifecycleEventsStrategy.setup();
lifecycleEventsStrategy.teardown();

expect(eventsSpy).to.be.calledThrice;
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

<a name="plugin"></a>
# Plugin
should be defined and loadable.

```js
expect(Plugin).to.not.be.undefined;
```

should be a function.

```js
expect(Plugin).to.be.a('function');
```

<a name="pluginservice"></a>
# PluginService
should be defined and loadable.

```js
expect(PluginService).to.not.be.undefined;
```

should be a function.

```js
expect(PluginService).to.be.a('function');
```

should validate arguments and throw if wrong.

```js
expect(()=>{
  new PluginService(null, null, null, null);
}).to.throw(PluginServiceValidationError);
expect(()=>{
  new PluginService();
}).to.throw(PluginServiceValidationError);
expect(()=>{
  new PluginService(mockLoaders, mockPluginStore, mockEventService);
}).to.throw(PluginServiceValidationError);
expect(()=>{
  new PluginService(mockLoaders, mockEventService);
}).to.throw(PluginServiceValidationError);
expect(()=>{
  new PluginService(mockPluginStore);
}).to.throw(PluginServiceValidationError);
expect(()=>{
  new PluginService(mockLoaders, mockPluginStore, mockLifecycleEventsStrategy, mockEventService);
}).to.not.throw();
```

should run scanForNewPlugins and set _running to true on start.

```js
var pluginService = new PluginService(
  mockLoaders, 
  mockPluginStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
sinon.spy(pluginService, "scanForNewPlugins");

expect(pluginService._running).to.equal(false);
pluginService.start();
expect(pluginService._running).to.equal(true);
expect(pluginService.scanForNewPlugins.calledOnce).to.equal(true);
pluginService.scanForNewPlugins.restore();
```

should cause loaders to run scanForNewPlugins on start.

```js
var loader1 = mockLoaders[0];
sinon.spy(loader1,"scanForNewPlugins");
var pluginService = new PluginService(
  mockLoaders, 
  mockPluginStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
pluginService.start();
expect(loader1.scanForNewPlugins.calledOnce).to.equal(true);
loader1.scanForNewPlugins.restore();
```

should trigger setup on lifecycleEventsStrategy during start.

```js
var strategySpy = sinon.spy(mockLifecycleEventsStrategy,"setup");

var pluginService = new PluginService(
  mockLoaders, 
  mockPluginStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
pluginService.start();
expect(strategySpy).to.have.been.calledOnce;
strategySpy.restore();
```

should trigger events on start / shutdown.

```js
var events = sinon.mock(mockEventService);
events.expects("trigger").once().calledWith(PLUGIN_SERVICE_STARTING_EVENT);
events.expects("trigger").once().calledWith(PLUGIN_SERVICE_STARTED_EVENT);
events.expects("trigger").once().calledWith(PLUGIN_SERVICE_SHUTTING_DOWN_EVENT);
events.expects("trigger").once().calledWith(PLUGIN_SERVICE_SHUTDOWN_EVENT);
var pluginService = new PluginService(
  mockLoaders, 
  mockPluginStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
pluginService.start();
pluginService.shutdown();
events.verify();
```

should run stopScanningForNewPlugins and set _running to false on shutdown.

```js
var pluginService = new PluginService(
  mockLoaders, 
  mockPluginStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
var mockService = sinon.mock(pluginService);
mockService.expects("stopScanningForNewPlugins").once();

pluginService.start();
expect(pluginService._running).to.equal(true);
pluginService.shutdown();
expect(pluginService._running).to.equal(false);
mockService.verify();
```

should cause loaders to run stopScanningForNewPlugins on shutdown.

```js
var loader1Spy = sinon.spy(mockLoaders[0],"stopScanningForNewPlugins");
var pluginService = new PluginService(
  mockLoaders, 
  mockPluginStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
pluginService.start();
pluginService.shutdown();
expect(loader1Spy).to.have.been.calledOnce;
loader1Spy.restore();
```

should call loaders scanForNewPlugins on scanForNewPlugins.

```js
var pluginLoader = sinon.mock(mockLoaders[0]);
pluginLoader.expects("scanForNewPlugins").once();
var pluginService = new PluginService(
  mockLoaders, 
  mockPluginStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
pluginService.scanForNewPlugins();
pluginLoader.verify();
```

should call loaders stopScanningForNewPlugins on stopScanningForNewPlugins.

```js
var pluginLoader = sinon.mock(mockLoaders[0]);
pluginLoader.expects("stopScanningForNewPlugins").once();
var pluginService = new PluginService(
  mockLoaders, 
  mockPluginStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
pluginService.stopScanningForNewPlugins();
pluginLoader.verify();
```

should call loaders getPlugins on getPlugins.

```js
var pluginLoader = sinon.mock(mockLoaders[0]);
pluginLoader.expects("getPlugins").once();
var pluginService = new PluginService(
  mockLoaders, 
  mockPluginStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
pluginService.getPlugins();
pluginLoader.verify();
```

should call loaders getPlugins on getPlugin.

```js
var pluginLoader = sinon.mock(mockLoaders[0]);
pluginLoader.expects("getPlugins").once();
var pluginService = new PluginService(
  mockLoaders, 
  mockPluginStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
pluginService.getPlugin();
pluginLoader.verify();
```

should call enablePlugin and disablePlugin in store during enable/disable.

```js
var store = sinon.mock(mockPluginStore);
     store.expects("enablePlugin").once();
     store.expects("disablePlugin").once();
     var events = sinon.mock(mockEventService);
     events.expects("trigger").once().withArgs(PLUGIN_ENABLED_EVENT);
     events.expects("trigger").once().withArgs(PLUGIN_DISABLED_EVENT);
     var pluginService = new PluginService(
       mockLoaders, 
       mockPluginStore, 
       mockLifecycleEventsStrategy, 
       mockEventService
     );
     pluginService.enablePlugin();
     pluginService.disablePlugin();
     store.verify();
     events.verify();
```

should call loaders getPluginModules on getPluginModules.

```js
var pluginService = new PluginService(
  mockLoaders, 
  mockPluginStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
var stub = sinon.stub().withArgs("plugin").returns({
  getModules: function(){ return [{},{}]}
});
pluginService.getPlugin = stub;
var modules = pluginService.getPluginModules();
expect(modules.length).to.equal(2);
```

should call getPluginModules on getPluginModule.

```js
var pluginService = new PluginService(
  mockLoaders, 
  mockPluginStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
var stub = sinon.stub().withArgs("plugin").returns({
  getModules: function(){ return [{
    getKey: function(){return "thisone"}
  },{
    getKey: function(){return "notthisone"}
  }]}
});
pluginService.getPlugin = stub;
var module = pluginService.getPluginModule("doesntmatter", "thisone");
expect(module.getKey()).to.equal("thisone");
```

should call enablePluginModule and disablePluginModule in store during enable/disable.

```js
var enableModuleSpy = sinon.spy(mockPluginStore, "enablePluginModule");
     var disableModuleSpy = sinon.spy(mockPluginStore, "disablePluginModule");
     var pluginService = new PluginService(
       mockLoaders, 
       mockPluginStore, 
       mockLifecycleEventsStrategy, 
       mockEventService
     );
     var stub = sinon.stub().withArgs("plugin").returns({
       getModules: function(){ return [{
         getKey: function(){return "thisone"}
       },{
         getKey: function(){return "notthisone"}
       }]}
     });
     pluginService.getPlugin = stub;
     pluginService.enablePluginModule("doesntmatter", "thisone");
     pluginService.disablePluginModule("doesntmatter", "thisone");
     expect(enableModuleSpy).to.have.been.calledOnce;
     expect(disableModuleSpy).to.have.been.calledOnce;
     enableModuleSpy.restore();
     disableModuleSpy.restore();
```

<a name="pluginstore"></a>
# PluginStore
should be defined and loadable.

```js
expect(PluginStore).to.not.be.undefined;
```

should be a function.

```js
expect(PluginStore).to.be.a('function');
```

<a name="webservice"></a>
# WebService
should be defined and loadable.

```js
expect(WebService).to.not.be.undefined;
```

should be a function.

```js
expect(WebService).to.be.a('function');
```

