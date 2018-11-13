# DockUI Plugin API

## DockUIPlugins

  > Wrapper to simplify initialisation of Plugin system

```javascript
/**
 * DockUIPlugins
 * Wrapper around Plugin services for easier usage
 * @constructor {DockUIPlugins.Builder} builder
 * @static DockUIPlugins.Builder
 * @method start - Starts framework
 * @throws DockuiFrameworkError
 */

 /**
 * DockUIPlugins.Builder
 * @method withStore
 * @method withEventService
 * @method withPluginService
 * @method withWebService
 * @method build - Returns new DockUIPlugins
 */
```

## PluginService

  > PluginService handles the loading of local or remote Plugin descriptors and enabling disabling plugins and respective modules

  PluginService Uses PluginLoaders to
     - load (detect/parse/validate/authenticate)
     - unload (remove/ignore/invalidate)
     - enable (make active)
     - disable (make inactive)
     plugins from different sources
  Uses PluginEventLifecycleStrategy to tie Plugin Events to
  Actions and PluginStore to save state

```javascript  
  Arguments
    PluginLoader[],
    PluginStore,
    PluginEventLifecycleStrategy,
    EventsService
  Properties
    loaders,store,strategy,events
  Methods
    scanForNewPlugins // Use loaders to scan for new Plugins
    enablePlugin      // Actually enable a plugin (+store state)
    disablePlugin     // Disable plugin (+store state)
```


## PluginLoader

  > Responsible for loading Plugins (Generating a Plugin object by parsing a plugin descriptor) from some location
  (e.g. db, File or Remote Docker container)
  @Throws PluginLoadError, PluginDescriptorParseError

```javascript  
  Arguments
    ModuleLoader[],
    EventsService
  Properties
    loaders,
    allPlugins,
    failedPlugins,
    ignoredPlugins,
    events
  Methods
    scanForNewPlugins
    enablePlugin
    disablePlugin
    ignorePlugin
```

## Plugin
  >Represents related set of Modules being provided to the system under a common Parent know as a Plugin.

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

## PluginStore
  Represents a Place to store information about the state of plugins such as whether they are
  Installed or enabled, disabled etc.

```javascript  
  Arguments
  Properties
  Methods
    set(key, val) - throws PluginStoreSaveException
    get(key) - throws PluginStoreUnknownKeyException
```

## PluginEventLifecycleStrategy
 > Represents a strategy used by PluginService to determine
 if a Plugin should be enabled or disabled when a given event
 is detected. Responsible for setting up listeners against the
 EventService and triggering the PluginService to act.

 ```javascript  
   Arguments
    PluginService, EventService
 ```

## PluginEvent
>  Model of Single Event in the PluginSystem.

```javascript  
  Arguments
  Properties
  Methods
```

## Errors
### DockuiFrameworkError
### PluginLoadError
### PluginDescriptorParseError
### ModuleDescriptorParseError
### PluginStoreSaveException
### PluginStoreUnknownKeyException
