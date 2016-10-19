# dockui
Experiment using docker microservices to build a composite web UI.

The idea is to create a central web portal that does nothing except handle monitoring for docker containers.
All functionality is added via the running of docker containers. Each container contributes a number of modules via a plugin.json or plugin.yml for example:

* decorator
* authproviders
* routes
* webitems ( links )
* webfragments ( page sections )
* webpages ( whole pages that can optionally be decorated )
* rest

Plugin docker containers are discovered using docker events and either connected via host network through proxy gateway and public port or via an overlay network via service name and private port.

You should be able to add and remove functionality simply by starting / stopping docker containers. So long as a minimum set of web UI components are running if the different services use common decoration etc then the experience of a filed service would simply be a menu item disappearing or a page segment gone or not.

Build and start the UI proxy first, then start any plugins independently. On a Dev machine just run them in seperate tabs.

# Build
```bash
docker build --tag dockui/proxy .
```

# Run Framework
```bash
cd bin
./startframework.sh
```

# Run Plugins in seperate tabs ( or build them and create a docker-compose file representing the site )
```bash
cd bundled-plugins/aui-theme-plugin/bin
./startplugin.sh
```

# TODO
* Get sessions working
* Improve code ( Bit messy )
* Figure out how to write tests for this
* Try it out using something like openshift
