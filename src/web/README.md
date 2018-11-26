# WebService

> The WebService provides a wrapper around common web functionality and sets up several extension points for plugin modules

## Functionality

* Starting / Stopping webserver
* Setting up global route handler at '/'.
* (Each delegates to a specific handler Service)
  * On Request Object
    * [RouterService] URL rewrite(s) - e.g. from pretty urls like /status to /plugin/{key}/module/{key}/statusPage.html
    * [AuthorisationService] Scope detection - find out if a request requires scopes and/or a logged in user
    * [AuthenticationService] login/logout and identify a logged in user
    * [AuthorisationService] Scope enforcer - check if identified user has required scopes (could be anon)
    * [CacheService] Cache (respond) - Ability to cache a resource for speedy subsequent retrieval ( policy set by modules )
    * [RequestHandlerService] - Actual request processors like webpage, rest, resource etc
  * On Response Object
    * [DecoratorService] (detection) - find out if page needs to be wrapped & add decorator to the res object
    * [ResourceService] (stripper) - remove inline css and js from decorator and page & add to res
    * [FragmentService] - fetch and inject fragment pages to required injection points
    * [DecoratorService] (Recombine) - merge decorator and page into single page
    * [ResourceService] (Injector) - Readd inline resouces, plus any resources added by modules
    * [CacheService] - update CacheService if this module asked to be cached.

## Request / Response Flow and extension points
### Request

```yaml
         [url-rewrite][scope-detector][authentication][authorization][cache][middleware][handler]
   o           |            |                |               |          |        |          |
  (_) -------->|            |                |               |          |        |          |
               |            |                |               |          |        |          |
  unpretty urls|----------->|                |               |          |        |          |
                            |                |               |          |        |          |
  detect & add scopes to req|--------------->|               |          |        |          |
                                             |               |          |        |          |
                      log user in if required|-------------->|          |        |          |
                                                             |          |        |          |
                              does user have required scopes?|--------->|        |          |
                                                                        |        |          |
                                  return cached resource if there is one|------->|          |
                                                                                 |          |
                                              all general middleware applied here|--------->|
                                                                                            |
                                                actually handle the main body of the request|------->
```

### Response

```yaml
            [cache][add-resources][decorate][fragments][strip-resources][decorator-detect]
   o           |           |           |         |             |                 |
  (_) <--------|           |           |         |             |                 |
               |           |           |         |             |                 |
 cache cachable|<----------|           |         |             |                 |
                           |           |         |             |                 |
    add resources into page|<----------|         |             |                 |
                                       |         |             |                 |
               wrap page with decorator|<--------|             |                 |
                                                 |             |                 |
                             inject any fragments|<------------|                 |
                                                               |                 |
                                    remove all inline resources|<----------------|
                                                                                 |
                                              does this page need to be decorated|<---------
```