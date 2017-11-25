# DOCKUI

> Compose a web app by feature using Docker micro-services

## Usage

```bash
dockui init
dockui add-demo-plugins
dockui start --environment dev
```

This will

-   Start a new dockui config file in the current folder
-   create a new overlay network for the microservices
-   build the demo plugins into the plugins folder from templates
-   start the api gateway and all the plugin containers in dev mode

You should now be able to visit <https://localhost:8080/dockui> to see the demo app.

The demo app is a fully functionig webapp which includes all of the plugin types of dockui and acts as a tutorial for using it.

## Hot Reload

All microservices are detected detected by monitoring the Docker events subsystem.

-   If a new container is detected then a plugin descriptor is searched for by service name and private port via HTTP GET request at the root context for plugin.yml or plugin.json.
-   If the container is removed and / or readded the descriptor is reloaded

## Plugin Modules

The plugin descriptor can be either a **plugin.json** or **plugin.yml**. It describes the various module types which the microservice is contributing to the overall application for example:

```yml
# Here you specify a name, key and version of your plugin which is used
# by the plugin service to instantiate a unique Plugin at runtime
# plugins are linked to their docker containers so when the container goes down the plugin is removed
name: "Plugin Name"
key: "example-plugin-key"
version: 1.0

# Modules do the work for the plugin. See the various types for explanation of what they do
modules:

  # Auth provider provide capabilities to authenticate the user session
  # As providers are chained, weight represents where in the order this will fire
    - type : "authprovider"
      name: "Auth Provider"
      key: "example-auth-provider"
      url: "/authenticate"
      weight: "10"

  # Routes are a way to rewrite more readable urls for a given webpage or resource
    - type : "route"
      name: "Example route"
      key: "example-route"
      routes:
        - "/example/*"
      path: "/plugins/example-plugin-key/webpages/$1"
      auth:
        scopes:
          - PLUGIN_ADMIN

  # Webitems are links that you can insert in various places in the webapp
  # Locations are defined within the html templates themselves
    - type : "webitem"
      name: "Example Webitem"
      key: "example-webitem"
      link: "/example/url"
      location: "example.home.header.links"
      weight: 10
      text: "Example Webitem"

  # Webfragments are html partials which will be injected into the specified location
  # for example to show a widget on an existing page ( like AUI dialog2 hidden dialog html )
  # the path is to the served html template, and the fragment is a CSS selector for a single element to
  # isolate from said template and use as the actual fragment for this module
    - type : "webfragment"
      name : "Example dialog widget"
      key : "example-dialog-widget"
      path : "/fragments"
      fragment : "#example-dialog-widget"
      location: "example.home.footer"
      weight : 10

  # Webpages are entire served html pages
  #   - Within the HTML you can define a decorator meta tag to cause the page to be decorated before serving
  #       - The decorator can be provided by this plugin or any other plugin
  #   - Within the HTML you can define a resourcesFor meta tag to have static resources injected from contributing plugins
    - type : "webpage"
      name : "Example Webpage"
      key : "example-webpage"
      path : "/example"
      auth:
        scopes:
          - APPLICATION_USER

  # Rest modules define a single endpoint that is simply proxied by the main api gateway
    - type : "rest"
      name : "example plugin management api"
      key : "example-manage-api"
      base : "/rest/api/1.0/plugins"

  # Web resources define static resources that you can contribute to existing webpages
  # by giving a context. The context is used by webpages via the resourcesFor Meta tag
    - type : "webresources"
      name : "Example webresources"
      key : "example-webresources"
      base : "/resources/"
      resources :
        - type: "js"
          path : "example.javascript.js"
        - type: "css"
          path : "example.style.css"
      context : "example.resources.context"
```

## API