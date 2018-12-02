# WebService

> The WebService provides a wrapper around common web functionality and sets up several extension points for plugin modules implemented as request middleware.

## Pseudo FLOW

```javascript
[middleware] if using short url then look it up and redirect to real url
[middleware] decorate req with plugin and module of the thing being requested
[middleware] if module requiresRoles then check user logged in. If not then log user in
[middleware] if module requires Roles and user Logged in then check user has roles. If not deny
[middleware] If module is cachable and cache not empty retrieve from cache.
[middleware] Fetch API or WebPage using url in Module and add result to Req
[middleware] if webPage parse it for [decorator,webFragments,webItems,resources] - add to Req
[middleware] if webPage strip out resources from template
[middleware] if webPage fetch all fragments from cache or remote url and add to req
[middleware] if webPage fetch decorator webPage from cache or remote and add to req
[middleware] if webPage fetch all resources from cache or remote and add to Req.
[middleware] if webPage (once all parts retrived using fullfilled Promise) recombine the page
[middleware] if module is cachable then cache the API or webPage here
[handler] handle the request immediately by returning the built response.
```