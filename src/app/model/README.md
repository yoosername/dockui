# App and AppModule definitions

For detailed information on App and AppModule configuration see: [Descriptor Reference](../../../src/app/dockui.app.yml)

## App

> An App is something which defines and provides one or more AppModules to influence the overall system.

* Apps can be Loaded, Unloaded, Enabled and Disabled.
* Apps provide AppModules via an AppDescriptor

## AppModule

> An AppModule defines a single piece of functionality that is being provided by an App. 

### Example AppModules

* WebItem ( e.g. add an item to a dropdown menu on an existing WebPage )
* WebPage ( e.g. add a whole new web page )
* WebFragmant ( e.g. add a HTML widget or block of javascript to an existing WebPage )
* WebResource ( e.g. add some CSS or JS to an existing WebPage )
* Api ( e.g. provide a new REST or Graphql API from the API gateway )
* Route ( e.g. add a pretty URL that forwards to any existing URL )
* AuthenticationProvider ( e.g. add a service which can identify users from request header)
* AuthorisationProvider ( e.g. add a service which can test a user has required Roles )
* Webhook (e.g. have your service called when some event happens)