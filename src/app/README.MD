# DockUI App API

## DockUIApps

  > Wrapper to simplify initialisation of App system

```javascript
/**
 * DockUIApps
 * Wrapper around App services for easier usage
 * @constructor {DockUIApps.Builder} builder
 * @static DockUIApps.Builder
 * @method start - Starts framework
 * @throws DockuiFrameworkError
 */

 /**
 * DockUIApps.Builder
 * @method withStore
 * @method withEventService
 * @method withAppService
 * @method withWebService
 * @method build - Returns new DockUIApps
 */
```

## AppService

  > AppService handles the loading of local or remote App descriptors and enabling disabling Apps and respective modules

  AppService Uses AppLoaders to
     - load (detect/parse/validate/authenticate)
     - unload (remove/ignore/invalidate)
     - enable (make active)
     - disable (make inactive)
     Apps from different sources
  Uses AppEventLifecycleStrategy to tie App Events to
  Actions and AppStore to save state

```javascript  
  Arguments
    AppLoader[],
    AppStore,
    AppEventLifecycleStrategy,
    EventsService
  Properties
    loaders,store,strategy,events
  Methods
    scanForNewApps // Use loaders to scan for new Apps
    enableApp      // Actually enable a App (+store state)
    disableApp     // Disable App (+store state)
```


## AppLoader

  > Responsible for loading Apps (Generating a App object by parsing a App descriptor) from some location
  (e.g. db, File or Remote Docker container)
  @Throws AppLoadError, AppDescriptorParseError

```javascript  
  Arguments
    ModuleLoader[],
    EventsService
  Properties
    loaders,
    allApps,
    failedApps,
    ignoredApps,
    events
  Methods
    scanForNewApps
    enableApp
    disableApp
    ignoreApp
```

## App
  >Represents related set of Modules being provided to the system under a common Parent know as a App.

```javascript  
  Arguments
    key,
    loader,
    modules,
    EventService
  Properties
    key,
    loader,
    modules,
    events
  Methods
    uuid:getKey,
    void:enable,
    void:disable
    [...modules]:getModules,
    enableModule,
    disableModule
    getModuleByType(type),
    getModuleByKey(type)
```

## ModuleLoader
  >Responsible for parsing a source Descriptor into
  the correct ModuleDescriptor object, validating it and
  generating a Module instance from it
  - returns a Module even if its a NoOp One

```javascript
  Arguments
    EventsService
  Properties
  Methods
    bool:canLoadModule(descriptor)
    module:loadModule(new ModuleDescriptor(descriptor))
    enableModule
    disableModule
```

## ModuleDescriptor
  >A builder which generates a specific Module Instance.
   - responsible for  

```javascript  
  Arguments
    sourceObj
  Throws ModuleDescriptorParseError
```

## Module

> An Instance of a particular ModuleDescriptor
(e.g. WebPage, WebItem)

### Built in Module types

  * LifecycleHook: A callback webhook to receive various system lifecycle events
    * synchronous: Allows a response from the hook to affect the outcome
    * async: used for simple notifying  
  * AuthProvider: Handles Logging a user in and testing if User is logged in
  * ScopeProvider: Handles Testing if Logged in User has particular scope
  * Route: Creates a Human Friendly Url rewrite to e.g. a module url
  * WebPage: A Single Web Page
    * metatag "decorator" allows you to define which other WebPage in the system wraps this one
    * metatag "resourcesFor" allows you to define a location which Resources can target for injection
  * WebFragment: a Piece of a WebPage to inject at some location defined in other WebPages
  * WebItem: a simple Link to inject at some location defined in WebPages
  * Rest: an API to be directly Proxied
  * Resources: One or more static Resources (js, css) to inject at some location in Webpages

```javascript  
  Arguments
  Properties
  Methods
```

## AppStore
  Represents a Place to store information about the state of Apps such as whether they are
  Installed or enabled, disabled etc.

```javascript  
  Arguments
  Properties
  Methods
    set(key, val) - throws AppStoreSaveException
    get(key) - throws AppStoreUnknownKeyException
```

## AppEventLifecycleStrategy
 > Represents a strategy used by AppService to determine
 if a App should be enabled or disabled when a given event
 is detected. Responsible for setting up listeners against the
 EventService and triggering the AppService to act.

 ```javascript  
   Arguments
    AppService, EventService
 ```

## AppEvent
>  Model of Single Event in the AppSystem.

```javascript  
  Arguments
  Properties
  Methods
```

## Errors
### DockuiFrameworkError
### AppLoadError
### AppDescriptorParseError
### ModuleDescriptorParseError
### AppStoreSaveException
### AppStoreUnknownKeyException
