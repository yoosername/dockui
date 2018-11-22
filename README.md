# DOCKUI

> Compose a single web app from loosely coupled Docker based micro apps

## Quick Start

To start a dockui App first start a new gateway like this:

### Run dockui gateway

```bash
docker run -d dockui-gateway -d -p 8000:8080 dockui/gateway:latest
```

A gateway is a bit dull without some plugins to add features so lets add some.

### Store a DOCKUI_PLUGIN_API_KEY for plugins to use later

```bash
export DOCKUI_PLUGIN_API_KEY=$(docker exec dockui-gateway cat /dockui-plugin-api-key)
```

### Add some plugins using the DOCKUI_PLUGIN_API_KEY

```bash
docker run -d -e API_KEY=${DOCKUI_PLUGIN_API_KEY} dockui-decorator dockui/demo-authprovider
docker run -d -e API_KEY=${DOCKUI_PLUGIN_API_KEY} dockui-decorator dockui/demo-scopeprovider
docker run -d -e API_KEY=${DOCKUI_PLUGIN_API_KEY} dockui-decorator dockui/demo-route
docker run -d -e API_KEY=${DOCKUI_PLUGIN_API_KEY} dockui-decorator dockui/demo-webpage-decorator
docker run -d -e API_KEY=${DOCKUI_PLUGIN_API_KEY} dockui-decorator dockui/demo-webpage-decorated
docker run -d -e API_KEY=${DOCKUI_PLUGIN_API_KEY} dockui-decorator dockui/demo-webfragment
docker run -d -e API_KEY=${DOCKUI_PLUGIN_API_KEY} dockui-decorator dockui/demo-webitem
docker run -d -e API_KEY=${DOCKUI_PLUGIN_API_KEY} dockui-decorator dockui/demo-rest
docker run -d -e API_KEY=${DOCKUI_PLUGIN_API_KEY} dockui-decorator dockui/demo-resource
```

You should now be able to visit <https://localhost:8080/dockui> to see the above demo app. You probably wouldn't
split up an app like this, but the demo plugins are done this way to show how everything is combined seamlessly.

## Hot Reload

All plugins are just containers and so are detected by monitoring the Docker events subsystem.

-   If a new container is detected then a plugin descriptor is searched for by service name and private port via HTTP GET request at the root context for plugin.yml or plugin.json.
-   If the plugin uses the correct API_KEY then plugin descriptor is parsed for modules
-   It it is a valid descriptor and has valid modules then modules are loaded and available on the gateway
-   If the container is removed and / or readded the descriptor and modules are reloaded

## Plugin Descriptor and Modules

The plugin descriptor can be either a **plugin.json** or **plugin.yml**. It describes the various module types which the microapp is contributing to the overall application for example:

```yml
# Here you specify a name, key and version of your Plugin(micro-app) which is used
# by the plugin service to instantiate a unique Plugin at runtime
# plugins are linked to their docker containers so when the container goes down the plugin is removed
# name: Human readable Name for this Plugin
# key: Unique key for this Plugin
# version: Version of this Plugin
# descriptor-version: Version of the Descriptor this Plugin is targeting.
name: "Plugin Name"
key: "example-plugin-key"
version: 1.0
descriptor-version: 1.0
icon: '/static/icon.png'

# Modules are the main components of the plugin. A plugin can provide zero or more modules to the system.
# See the various types for explanation of what they do
modules:

  # Lifecycle hooks provide the ability to sycronously act on various parts of the plugin
  # system. For example determine if a plugin should be installed or not. Or asynconrously
  # participate, for example to register an audit log listener for all events.
    - type : "lifecyclehook"
      name: "Lifecycle Hook"
      key: "example-lifecycle-hook"
      type: "async"
      url: "/lifecycle"
      weight: "10"

  # Auth provider provide capabilities to authenticate the user session
  # As providers are chained, weight represents where in the order this will fire
    - type : "authprovider"
      name: "Auth Provider"
      key: "example-auth-provider"
      url: "/authenticate"
      weight: "10"

  # Scope provider provides capabilities to check if the current authenticated user
  # has the required scope
  # As providers are chained, weight represents where in the order this will fire
    - type : "scopeprovider"
      name: "Scope Provider"
      key: "example-scope-provider"
      url: "/check-scope"
      weight: "10"

  # Routes are a way to rewrite more readable urls for a given webpage or resource
    - type : "route"
      name: "Example route"
      key: "example-route"
      routes:
        - "/example/*"
      path: "/plugins/example-plugin-key/webpages/$1"
      auth:
        required: true
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
        required: true
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

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## How to create a Plugin
