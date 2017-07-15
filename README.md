# DOCKUI
Experiment using Docker micro-services to build a composite web UI.

The idea is to create a central web service which only handles the following:

* Monitoring attached docker containers
* Registering / unregistering plugins based on presence of plugin descriptor
* Web / Api gateway and routing traffic to plugins

All additional functionality is provided by plugins.

# Features
## Docker containers
All new docker containers are detected via the events subsystem.

* If using host network then the proxy gateway and public port are checked for a plugin descriptor.
* If using overlay network then plugin descriptor is searched for by service name and private port.

## Plugins
A Docker container is considered to be a Plugin if it exposes a valid Plugin descriptor ( e.g. plugin.yml ) from the root of the detected host:port via HTTP at the root context.

## Plugin Descriptor
The plugin descriptor can be either a """plugin.json""" or """plugin.yml""". It describes the various module types which the plugin is making available to the system for example:

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
### Usage
You should be able to add and remove functionality simply by starting / stopping docker containers.

So a minimal webapp may be a single webpage and decorator, some resources a couple of routes and some rest endpoints. That can be split into 1 or more plugins via multiple Docker containers depending on the need for chopping and changing components.

# Quick start
```bash
git clone https://github.com/yoosername/dockui
cd dockui && ./start.sh
```

# Development
Build and start the UI proxy first, then start any plugins independently. On a Dev machine just run them in separate tabs.

## Prereqs
* docker
* docker-compose

## Build Framework example
```bash
git clone https://github.com/yoosername/dockui && cd dockui
docker build --tag dockui/proxy .
```

## Build Plugin example
```bash
git clone https://github.com/yoosername/dockui && cd dockui
cd bundled-plugins/aui-theme-plugin
docker build --tag dockui/aui-theme-plugin .
```

## Run individual Plugin example ( dev mode )
tip: do this is separate tabs so you can see whats going on

```bash
git clone https://github.com/yoosername/dockui && cd dockui
cd bundled-plugins/aui-theme-plugin
./start.sh
```

# TODO
* Implement some form of caching
* Figure out how to write tests
