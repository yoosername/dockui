# TOC
   - [App](#app)
   - [AppDescriptor](#appdescriptor)
   - [ModuleDescriptor](#moduledescriptor)
   - [DockUIApps](#dockuiapps)
   - [DockUIAppsBuilder](#dockuiappsbuilder)
   - [HttpClient](#httpclient)
   - [AppLoader](#apploader)
   - [CachableModuleLoader](#cachablemoduleloader)
   - [DockerEventsDelegatingAppLoader](#dockereventsdelegatingapploader)
   - [UrlAppLoader](#urlapploader)
   - [ModuleLoader](#moduleloader)
   - [Module](#module)
   - [AppPermission](#apppermission)
   - [SecurityContext](#securitycontext)
   - [AppService](#appservice)
   - [EventService](#eventservice)
   - [LifecycleEventsStrategy](#lifecycleeventsstrategy)
   - [AppStore](#appstore)
   - [InMemoryAppStore](#inmemoryappstore)
   - [WebService](#webservice)
<a name=""></a>
 
<a name="app"></a>
# App
should be defined and loadable.

```js
expect(App).to.not.be.undefined;
```

should be a function.

```js
expect(App).to.be.a('function');
```

<a name="appdescriptor"></a>
# AppDescriptor
should be defined and loadable.

```js
expect(AppDescriptor).to.not.be.undefined;
```

should be a function.

```js
expect(AppDescriptor).to.be.a('function');
```

should validate a correct JSON obj.

```js
expect(()=>{
    new AppDescriptor();
}).to.throw();
expect(()=>{
    new AppDescriptor(null,null,null);
}).to.throw();
expect(()=>{
    new AppDescriptor(undefined,"",false);
}).to.throw();
expect(()=>{
    new AppDescriptor({
        key : "AppKey",
        url : "http://bla.bla"
    });
}).to.throw();
expect(()=>{
    new AppDescriptor({
        key : "AppKey",
        url : "http://bla.bla",
        lifecycle : {
            loaded : "/myurl"
        },
        authentication : {
            type : "jwt"
        }
    });
}).to.not.throw();
```

<a name="moduledescriptor"></a>
# ModuleDescriptor
should be defined and loadable.

```js
expect(ModuleDescriptor).to.not.be.undefined;
```

should be a function.

```js
expect(ModuleDescriptor).to.be.a('function');
```

should validate a an object with at least key type and name.

```js
expect(()=>{
    new ModuleDescriptor();
}).to.throw();
expect(()=>{
    new ModuleDescriptor(null,null,null);
}).to.throw();
expect(()=>{
    new ModuleDescriptor(undefined,"",false);
}).to.throw();
expect(()=>{
    new ModuleDescriptor({
        key : "ModuleKey",
        url : "http://bla.bla"
    });
}).to.throw();
expect(()=>{
    new ModuleDescriptor({
        key : "test.module",
        type : "vanilla",
        name : "test module"
    });
}).to.not.throw();
```

<a name="dockuiapps"></a>
# DockUIApps
should be defined and loadable.

```js
expect(DockUIApps).to.not.be.undefined;
```

should be a function.

```js
expect(DockUIApps).to.be.a('function');
```

Should return a DockUIApps.Builder if one isnt passed as arg.

```js
var builder = new DockUIApps();
expect(builder).to.be.instanceof(DockUIAppsBuilder);
```

should start AppService.start method when start() called.

```js
var AppService = sinon.mock(mockAppService);
AppService.expects("start").once();

var dockUIApps = new DockUIAppsBuilder()
  .withStore(mockStore)
  .withEventService(mockEventService)
  .withAppService(mockAppService)
  .withWebService(mockWebService)
  .build();
dockUIApps.start();
AppService.verify();
```

should call WebService.stop method when stop() called.

```js
var webService = sinon.mock(mockWebService);
webService.expects("shutdown").once();

var dockUIApps = new DockUIAppsBuilder()
  .withStore(mockStore)
  .withEventService(mockEventService)
  .withAppService(mockAppService)
  .withWebService(mockWebService)
  .build();
dockUIApps.shutdown();
webService.verify();
```

<a name="dockuiappsbuilder"></a>
# DockUIAppsBuilder
should be able to set the Store.

```js
new DockUIAppsBuilder().withStore(mockStore);
```

should be able to set the EventService.

```js
new DockUIAppsBuilder().withEventService(mockEventService);
```

should be able to set the AppService.

```js
new DockUIAppsBuilder().withAppService(mockAppService);
```

should be able to set the WebService.

```js
new DockUIAppsBuilder().withWebService(mockWebService);
```

should return a DockUIApps instance when build is called.

```js
const dockuiAppsInstance = new DockUIAppsBuilder()
  .withStore(mockStore)
  .withEventService(mockEventService)
  .withAppService(mockAppService)
  .withWebService(mockWebService)
  .build();
expect(dockuiAppsInstance).to.be.an.instanceOf(DockUIApps);
```

should validate when build is called.

```js
expect(function(){
  new DockUIAppsBuilder()
    .withEventService(mockEventService)
    .withAppService(mockAppService)
    .withWebService(mockWebService)
    .build();
}).to.throw(MissingStoreDuringSetupError);  
expect(function(){
  new DockUIAppsBuilder()
    .withStore(mockStore)
    .withAppService(mockAppService)
    .withWebService(mockWebService)
    .build();
}).to.throw(MissingEventServiceDuringSetupError);  
expect(function(){
  new DockUIAppsBuilder()
    .withStore(mockStore)
    .withEventService(mockEventService)
    .withWebService(mockWebService)
    .build();
}).to.throw(MissingAppServiceDuringSetupError);  
expect(function(){
  new DockUIAppsBuilder()
    .withStore(mockStore)
    .withEventService(mockEventService)
    .withAppService(mockAppService)
    .build();
}).to.throw(MissingWebServiceDuringSetupError);
```

<a name="httpclient"></a>
# HttpClient
should be defined and loadable.

```js
expect(HttpClient).to.not.be.undefined;
```

should be a function.

```js
expect(HttpClient).to.be.a('function');
```

<a name="apploader"></a>
# AppLoader
should be defined and loadable.

```js
expect(AppLoader).to.not.be.undefined;
```

should be a function.

```js
expect(AppLoader).to.be.a('function');
```

should validate its arguments correctly.

```js
expect(()=>{
    new AppLoader();
}).to.throw();
expect(()=>{
    new AppLoader(null,null,null);
}).to.throw();
expect(()=>{
    new AppLoader(undefined,"",false);
}).to.throw();
expect(()=>{
    new AppLoader(mockAppStore,mockModuleLoaders,mockEventService);
}).to.not.throw();
```

addApp and removeApp should increase and decrease the cache correctly.

```js
const loader = new AppLoader(mockAppStore,mockModuleLoaders,mockEventService);
const app1 = new MockApp();
const app2 = new MockApp();
expect(loader.loadedApps.length).to.equal(0);
loader.addApp(app1);
loader.addApp(app2);
expect(loader.loadedApps.length).to.equal(2);
loader.removeApp(app1);
expect(loader.loadedApps.length).to.equal(1);
expect(loader.loadedApps[0]).to.eql(app2);
```

<a name="cachablemoduleloader"></a>
# CachableModuleLoader
should be defined and loadable.

```js
expect(CachableModuleLoader).to.not.be.undefined;
```

should be a function.

```js
expect(CachableModuleLoader).to.be.a('function');
expect(()=>{new CachableModuleLoader();}).not.to.throw();
expect(new CachableModuleLoader()).to.be.an.instanceOf(CachableModuleLoader);
```

should return from the cache the same as you put into it.

```js
const loader = new CachableModuleLoader();
const descriptor = {
    type: "fakeDescriptor",
    url: "/some/url",
    name: "name",
    key: "key"
};
const state = {
    loaded: true,
    descriptor: descriptor,
    module: {}
};
loader.setCache(descriptor, state);
var cachedState = loader.getCache(descriptor);
expect(cachedState).to.eql(state);
```

<a name="dockereventsdelegatingapploader"></a>
# DockerEventsDelegatingAppLoader
should be defined and loadable.

```js
expect(DockerEventsDelegatingAppLoader).to.not.be.undefined;
```

should be a function.

```js
expect(DockerEventsDelegatingAppLoader).to.be.a('function');
```

<a name="urlapploader"></a>
# UrlAppLoader
should be defined and loadable.

```js
expect(UrlAppLoader).to.not.be.undefined;
```

should be a function.

```js
expect(UrlAppLoader).to.be.a('function');
```

<a name="moduleloader"></a>
# ModuleLoader
should be defined and loadable.

```js
expect(ModuleLoader).to.not.be.undefined;
```

should be a function.

```js
expect(ModuleLoader).to.be.a('function');
expect(()=>{new ModuleLoader();}).not.to.throw();
expect(new ModuleLoader()).to.be.an.instanceOf(ModuleLoader);
```

should log a warning if you dont extend the default behaviour.

```js
var logSpy = sinon.stub(console,"warn");
const loader = new ModuleLoader();
expect(loader.canLoadModuleDescriptor).to.be.a('function');
expect(loader.loadModuleFromDescriptor).to.be.a('function');
loader.canLoadModuleDescriptor();
expect(logSpy).to.be.called.callCount(1);
loader.loadModuleFromDescriptor();
expect(logSpy).to.be.called.callCount(2);
logSpy.restore();
```

<a name="module"></a>
# Module
should be defined and loadable.

```js
expect(Module).to.not.be.undefined;
```

should be a function.

```js
expect(Module).to.be.a('function');
```

should validate arguments.

```js
expect(function(){
  new Module();
}).to.throw();
expect(function(){
  new Module(null,null,null);
}).to.throw();
expect(function(){
  new Module(undefined,undefined,undefined);
}).to.throw();
expect(function(){
  new Module(mockApp,mockApp,"");
}).to.throw();
expect(function(){
  new Module(mockApp,mockModuleDescriptor);
}).to.not.throw();
```

should respond with correct Key.

```js
var MODULE_KEY = "mockModuleKey";
var module = new Module(mockApp,mockModuleDescriptor);
expect(module.getKey() === MODULE_KEY).to.equal(true);
```

should respond with correct Type.

```js
var MODULE_TYPE = "mockModuleType";
var module = new Module(mockApp,mockModuleDescriptor);
expect(module.getType() === MODULE_TYPE).to.equal(true);
```

<a name="apppermission"></a>
# AppPermission
should be defined and loadable.

```js
expect(AppPermission).to.not.be.undefined;
```

should be a function.

```js
expect(AppPermission).to.be.an('object');
```

should only contain READ,WRITE,ADMIN.

```js
expect(AppPermission.READ).to.be.a('string');
expect(AppPermission.WRITE).to.be.a('string');
expect(AppPermission.ADMIN).to.be.a('string');
expect(Object.keys(AppPermission).length).to.equal(3);
```

<a name="securitycontext"></a>
# SecurityContext
should be defined and loadable.

```js
expect(SecurityContext).to.not.be.undefined;
```

should be a function.

```js
expect(SecurityContext).to.be.a('function');
```

<a name="appservice"></a>
# AppService
should be defined and loadable.

```js
expect(AppService).to.not.be.undefined;
```

should be a function.

```js
expect(AppService).to.be.a('function');
```

should validate arguments and throw if wrong.

```js
expect(()=>{
  new AppService(null, null, null, null);
}).to.throw(appServiceValidationError);
expect(()=>{
  new AppService();
}).to.throw(appServiceValidationError);
expect(()=>{
  new AppService(mockAppLoaders, mockAppStore, mockEventService);
}).to.throw(appServiceValidationError);
expect(()=>{
  new AppService(mockAppLoaders, mockEventService);
}).to.throw(appServiceValidationError);
expect(()=>{
  new AppService(mockAppStore);
}).to.throw(appServiceValidationError);
expect(()=>{
  new AppService(mockAppLoaders, mockAppStore, mockLifecycleEventsStrategy, mockEventService);
}).to.not.throw();
```

should run scanForNewApps and set _running to true on start.

```js
var appService = new AppService(
  mockAppLoaders, 
  mockAppStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
sinon.spy(appService, "scanForNewApps");

expect(appService._running).to.equal(false);
appService.start();
expect(appService._running).to.equal(true);
expect(appService.scanForNewApps.calledOnce).to.equal(true);
appService.scanForNewApps.restore();
```

should cause loaders to run scanForNewApps on start.

```js
var loader1 = mockAppLoaders[0];
sinon.spy(loader1,"scanForNewApps");
var appService = new AppService(
  mockAppLoaders, 
  mockAppStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
appService.start();
expect(loader1.scanForNewApps.calledOnce).to.equal(true);
loader1.scanForNewApps.restore();
```

should trigger setup on lifecycleEventsStrategy during start.

```js
var strategySpy = sinon.spy(mockLifecycleEventsStrategy,"setup");

var appService = new AppService(
  mockAppLoaders, 
  mockAppStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
appService.start();
expect(strategySpy).to.have.been.calledOnce;
strategySpy.restore();
```

should emit events on start / shutdown.

```js
var events = sinon.mock(mockEventService);
events.expects("emit").once().calledWith(APP_SERVICE_STARTING_EVENT);
events.expects("emit").once().calledWith(APP_SERVICE_STARTED_EVENT);
events.expects("emit").once().calledWith(APP_SERVICE_SHUTTING_DOWN_EVENT);
events.expects("emit").once().calledWith(APP_SERVICE_SHUTDOWN_EVENT);
var appService = new AppService(
  mockAppLoaders, 
  mockAppStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
appService.start();
appService.shutdown();
events.verify();
```

should run stopScanningForNewApps and set _running to false on shutdown.

```js
var appService = new AppService(
  mockAppLoaders, 
  mockAppStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
var mockService = sinon.mock(appService);
mockService.expects("stopScanningForNewApps").once();

appService.start();
expect(appService._running).to.equal(true);
appService.shutdown();
expect(appService._running).to.equal(false);
mockService.verify();
```

should cause loaders to run stopScanningForNewApps on shutdown.

```js
var loader1Spy = sinon.spy(mockAppLoaders[0],"stopScanningForNewApps");
var appService = new AppService(
  mockAppLoaders, 
  mockAppStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
appService.start();
appService.shutdown();
expect(loader1Spy).to.have.been.calledOnce;
loader1Spy.restore();
```

should call loaders scanForNewApps on scanForNewApps.

```js
var AppLoader = sinon.mock(mockAppLoaders[0]);
AppLoader.expects("scanForNewApps").once();
var appService = new AppService(
  mockAppLoaders, 
  mockAppStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
appService.scanForNewApps();
AppLoader.verify();
```

should call loaders stopScanningForNewApps on stopScanningForNewApps.

```js
var AppLoader = sinon.mock(mockAppLoaders[0]);
AppLoader.expects("stopScanningForNewApps").once();
var appService = new AppService(
  mockAppLoaders, 
  mockAppStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
appService.stopScanningForNewApps();
AppLoader.verify();
```

should call loaders getApps on getApps.

```js
var AppLoader = sinon.mock(mockAppLoaders[0]);
AppLoader.expects("getApps").once();
var appService = new AppService(
  mockAppLoaders, 
  mockAppStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
appService.getApps();
AppLoader.verify();
```

should call loaders getApps on getApp.

```js
var AppLoader = sinon.mock(mockAppLoaders[0]);
AppLoader.expects("getApps").once();
var appService = new AppService(
  mockAppLoaders, 
  mockAppStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
appService.getApp();
AppLoader.verify();
```

should call loaders getModules on getModules.

```js
var appService = new AppService(
  mockAppLoaders, 
  mockAppStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
var stub = sinon.stub().withArgs("App").returns({
  getModules: function(){ return [{},{}]}
});
appService.getApp = stub;
var modules = appService.getModules();
expect(modules.length).to.equal(2);
```

should call getModules on getModule.

```js
var appService = new AppService(
  mockAppLoaders, 
  mockAppStore, 
  mockLifecycleEventsStrategy, 
  mockEventService
);
var stub = sinon.stub().withArgs("App").returns({
  getModules: function(){ return [{
    getKey: function(){return "thisone"}
  },{
    getKey: function(){return "notthisone"}
  }]}
});
appService.getApp = stub;
var module = appService.getModule("doesntmatter", "thisone");
expect(module.getKey()).to.equal("thisone");
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
        mockEventService,
        mockAppStore
    );
}).to.not.throw();
```

should detach the same number of event listeners as have been added during teardown.

```js
var addSpy = sinon.spy(mockEventService,"addListener");
var removeSpy = sinon.spy(mockEventService,"removeListener");

var lifecycleEventsStrategy = new LifecycleEventsStrategy(
    mockEventService,
    mockAppStore
);
lifecycleEventsStrategy.setup();
var addedCount = addSpy.callCount;
lifecycleEventsStrategy.teardown();

expect(removeSpy).to.be.called.callCount(addedCount);
```

<a name="appstore"></a>
# AppStore
should be defined and loadable.

```js
expect(AppStore).to.not.be.undefined;
```

should be a function.

```js
expect(AppStore).to.be.a('function');
expect(()=>{
  new AppStore();
}).to.not.throw();
```

should have correct signature.

```js
const store = new AppStore(mockEventService);
expect(store.get).to.be.a('function');
expect(store.set).to.be.a('function');
expect(store.delete).to.be.a('function');
```

should log a warning if you dont extend the default behaviour.

```js
var logSpy = sinon.stub(console,"warn");
const store = new AppStore(mockEventService);
expect(store.get).to.be.a('function');
expect(store.set).to.be.a('function');
expect(store.delete).to.be.a('function');
expect(store.enableApp).to.be.a('function');
expect(store.disableApp).to.be.a('function');
expect(store.enableModule).to.be.a('function');
expect(store.disableModule).to.be.a('function');
store.get();
store.set();
store.delete();
store.enableApp();
store.disableApp();
store.enableModule();
store.disableModule();
expect(logSpy).to.be.called.callCount(7);
logSpy.restore();
```

<a name="inmemoryappstore"></a>
# InMemoryAppStore
should be defined and loadable.

```js
expect(InMemoryAppStore).to.not.be.undefined;
```

should be a function.

```js
expect(InMemoryAppStore).to.be.a('function');
```

should return the same thing you save into it.

```js
const store = new InMemoryAppStore();
store.set("TEST1", "value1");
store.set("TEST2", "value2");
expect(store.get("TEST2")).to.eql("value2");
expect(store.get("TEST1")).to.eql("value1");
```

should delet the correct item.

```js
const store = new InMemoryAppStore();
store.set("TEST1", "value1");
store.set("TEST2", "value2");
store.set("TEST3", "value3");
store.delete("TEST2");
expect(store.get("TEST1")).to.equal("value1");
expect(store.get("TEST2")).to.equal(undefined);
expect(store.get("TEST3")).to.equal("value3");
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

should know if its running or not.

```js
const web = new WebService(mockEventService);
expect(web.isRunning()).to.equal(false);
web.start();
expect(web.isRunning()).to.equal(true);
web.shutdown();
expect(web.isRunning()).to.equal(false);
```

should fire start and stop events.

```js
const spy = sinon.spy(mockEventService, "emit");
const web = new WebService(mockEventService);
web.start();
expect(spy.calledTwice).to.equal(true);
```

