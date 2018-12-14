# App and Module definitions

For detailed information on App and Module configuration see: [Descriptor Reference](../../../src/app/dockui.app.yml)

## App

> An App is something which defines and provides one or more features to the overall system in the form of Modules.

* Apps can be Loaded, Unloaded, Enabled and Disabled.
* Apps provide Modules via an AppDescriptor

## Module

> A Module defines a single feature that is being provided by an App.

### Example Modules

* WebItem ( e.g. add an item to a dropdown menu on an existing WebPage )
* WebPage ( e.g. add a whole new web page )
* WebFragmant ( e.g. add a HTML widget or block of javascript to an existing WebPage )
* WebResource ( e.g. add some CSS or JS to an existing WebPage )
* Api ( e.g. provide a new REST or Graphql API from the API gateway )
* Route ( e.g. add a pretty URL that forwards to any existing URL )
* AuthenticationProvider ( e.g. add a service which can identify users from request header)
* AuthorisationProvider ( e.g. add a service which can test a user has required Roles )
* Webhook (e.g. have your service called when some event happens)