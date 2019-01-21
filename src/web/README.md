# WebService

> The WebService provides a wrapper around common web functionality and sets up several extension points for plugin modules implemented as request middleware.

## Management API

> Provides HTTP based API for common dockui management features e.g.

* Load App
  * When loading an app the global admin must grant it one of the following three framework permissions e.g.
    * READ (App can be notified about events but cannot contribute any modules which modify the system)
    * READ,WRITE ( App can also contribute Modules such as WebPage WebResource etc which may modify behaviour )
    * READ,WRITE,ADMIN ( App can also use the managment API to e.g. load,unload,enable,diable Apps and Modules )
* Unload App
* Enable App
* Disable App
* Load App Modules
* Unload App Modules
* Enable App Module
* Disable App Module

### Authentication

Authentication to the Management API is performed in the following 2 ways:

* Check if user is global admin and password is global admin password
* Check if valid AppKey signed using shared secret and
  * App is loaded
  * App is enabled
  * App was granted ADMIN permission

## DockUI Middleware

> This is the bread and butter of the DockUI framework where all of the loaded and enabled app modules are weaved into a single User Experience.

### Pseudo FLOW

```javascript
[middleware] if using short url then look it up and redirect to real url
[middleware] decorate req with plugin and module of the thing being requested
[middleware] if module requiresRoles then check user logged in. If not then log user in
[middleware] if module requires Roles and user Logged in then check user has roles. If not deny
[middleware] If module is cachable and cache not empty retrieve from cache.
[middleware] Fetch API or WebPage using url in Module and add result to Res
[middleware] if webPage parse it for [decorator,webFragments,webItems,resources] - add to Res
[middleware] if webPage strip out resources from template and update Res
[middleware] if webPage fetch all fragments from cache or remote url and update Res
[middleware] if webPage fetch decorator webPage from cache or remote and update Res
[middleware] if webPage fetch all resources from cache or remote and update Res
[middleware] if webPage (once all parts retrieved using fullfilled Promise) recombine the page and update Res
[middleware] if module is cachable then cache the complete API or webPage here
[handler] handle the request immediately by returning the built response.
```