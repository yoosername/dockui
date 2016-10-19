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

# Prereqs
* docker
* docker-compose

# Build Framework example
```bash
git clone https://github.com/yoosername/dockui
docker build --tag dockui/proxy .
```

# Run Framework example
```bash
cd bin
./startframework.sh
```

# Run Plugin example ( dev mode )
do this is seperate tabs so you can see whats going on

```bash
cd bundled-plugins/aui-theme-plugin/bin
./startplugin.sh
```

# Build Plugin example
```bash
cd bundled-plugins/aui-theme-plugin/bin
docker build --tag dockui/aui-theme-plugin .
```

# Run whole site example
Simply build a docker-compose file containing all of the services making up your site and run it like this:
```bash
docker-compose up -d .
```

# TODO
* Get sessions working
* Improve code ( Bit messy )
* Figure out how to write tests for this
* Try it out using something like openshift
