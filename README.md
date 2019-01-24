# DOCKUI

> Compose a single web experience from loosely coupled Docker based Apps
> This is a **DRAFT** of a _work in progress_ and none of the commands below should be expected to work

## Quick Start

### Install the CLI

```bash
$ sudo npm install -g @dockui/cli
...
```

### Initialise a new framework instance

```shell
$ dockui init [<name> <filename> -y]
...
Created new Dockui instance config in ./dockui.yml
```

This will create a Dockui instance config following these rules:

* If no *filename* specified it will be created in a file called dockui.yml in the current directory
* If no *name* specified then it will use the default of "prod"
  * If the named section already exists it will be overwritten
  * There can be multiple instances specified by name
* If a -y flag present all of the defaults will be chosen
* If no -y flag then you will be prompted for answers to setup the instance

```yaml
---
version: "1.0"
instances:
  prod:
    name: "Human Readable Name"
    uuid: "generated-instance-uuid-c4c5453c4"
    description: "A longer description of this instance"
    management:
      api:
        socket:
          path: "/var/dockui/sockets/{uuid}"
        http:
          port: "8008"
        creds:
          user: "admin"
          password: "generatedInstanceGlobalAdminPassword"
default: "prod"
```

### Run a framework instance

> The --config option can be ignored if the config file is in the current directory
> The **instance** argument can be ignored if a **_default_** is specified in the config

```shell
dockui run [<instance> --config <configPath> -fg]
```

```shell
$ dockui run
Running Dockui instance 2ce46c5e in daemon mode, forwarding logs to /var/log/dockui/2ce46c5e.log
```

### List Loaded Apps per instance

```shell
dockui app ls [<instance> --config <configPath>]
```

```shell
$ dockui app ls
Instance     App                   UUID         State                            Modules
-----------------------------------------------------------------------------------------
2ce46c5e     Demo Theme App        3cd6745f     Loaded (enabled)                 12
2ce46c5e     Demo ReadOnly App     6ec43a77     UnLoaded (Awaiting Approval)     5
2ce46c5e     Demo Dynamic App      37fe3c2c     Loaded (disabled)                8
```

### Loading Apps

There are two types of App **"static"** and **"dynamic"**.

* Static Apps can be loaded directly from a URL or File and will be cached.
* Dynamic Apps may require some build steps if they are not already running
  * For example building and starting the respective docker image etc

```shell
dockui app install [<instance>] <url> [--permission <permission> --config <configPath> -y]
```

### Load an App from a Github repo (dynamic)

```shell
$ dockui app install https://github/yoosername/dockui-app-nodejs-demo --permission admin -y
[CLI] Notify New Git based App to load
[GitRepoLoader] Detected new Git based App load request
[GitRepoLoader] Cloning Dockui App https://github/yoosername/dockui-app-nodejs-demo to ~/.dockui/cache/3cd6745f
[GitRepoLoader] Notify New filesystem based App to load
[FileLoader] Detected new file based App load request
[FileLoader] Parsing Dockui App descriptor ~/.dockui/cache/3cd6745f/dockui.app.yml
[FileLoader] Type is 'dynamic' so App will need to be build and run first
[FileLoader] Detected Build instructions in ~/.dockui/cache/3cd6745f/dockui.app.yml
[FileLoader] Notify (New filesystem based App to build) request needs validation
[RequestGuardian] Request is correct and Permission was explicitly granted by CLI
[RequestGuardian] Notify New filesystem based App to build and cache validation result
[BuilderLoader] App build requested for App(3cd6745f) from source dir (~/.dockui/cache/3cd6745f)
[BuilderLoader] Starting App(3cd6745f) build
[BuilderLoader] Running build sandbox attached to (~/.dockui/cache/3cd6745f)
[BuilderLoader] sandbox cmd: docker build --tag dockuidemo .
[BuilderLoader] sandbox cmd: docker run -t dockuidemo
[DockerLoader] Detected new running Docker container
[DockerLoader] Notify New Remote URL based App to load
[URLLoader] Detected new App URL load request for http://localhost:31245/dockui.app.yml
[URLLoader] Notify (New URL based App to build) request needs validation
[RequestGuardian] Request validation is cached as authorised
[RequestGuardian] Notify New URL based App to build
[URLLoader] Loaded App with key(demo.app) successfully and enabled (10) out of (10) modules
```

### Load an App from a Github repo (static)

```shell
$ dockui app install https://github/yoosername/dockui-app-static-demo --permission write -y
[CLI] Notify New Git based App to load
[GitRepoLoader] Detected new Git based App load request
[GitRepoLoader] Cloning Dockui App https://github/yoosername/dockui-app-static-demo to ~/.dockui/cache/4ce675ef
[GitRepoLoader] Notify New filesystem based App to load
[FileLoader] Detected new file based App load request
[FileLoader] Parsing Dockui App descriptor ~/.dockui/cache/4ce675ef/dockui.app.yml
[FileLoader] Type is 'static' so App can be loaded directly.
[FileLoader] Notify (New filesystem based App to build) request needs validation
[RequestGuardian] Request is correct and Permission was explicitly granted by CLI
[RequestGuardian] Notify New filesystem based App to build and cache validation result
[FileLoader] Loaded App with key(demo.static.app) successfully and enabled (5) out of (5) modules
```

### Load an App from a Docker container image (dynamic)

```shell
$ dockui app install dockui/demoapp --permission write -y
[CLI] Notify New Docker Image based App to load
[DockerLoader] Detected new Docker Image App load request
[DockerLoader] Attempting to start container using image dockui/demoapp
[DockerLoader] Detected new running Docker container
[DockerLoader] Notify New Remote URL based App to load
[URLLoader] Detected new App URL load request for http://localhost:31245/dockui.app.yml
[URLLoader] Request not authorized so Notify (New URL based App to build) request needs validation
[RequestGuardian] Request is correct and Permission was explicitly granted by CLI
[RequestGuardian] Notify New URL based App to build and cache validation result
[URLLoader] Request is authorized so continue
[URLLoader] Loaded App with key(demo.app) successfully and enabled (10) out of (10) modules
```

### Load an App from a remote URL (dynamic)

```shell
$ dockui app install https://some.remote.url/dockui.app.yml --permission read -y
[CLI] Notify New URL based App to load
[URLLoader] Detected new App URL load request for https://some.remote.url/dockui.app.yml
[URLLoader] Request not authorized so Notify (New URL based App to build) request needs validation
[RequestGuardian] Request is correct and Permission was explicitly granted by CLI
[RequestGuardian] Notify New URL based App to build and cache validation result
[URLLoader] Request is authorized so continue
[URLLoader] Loaded App with key(demo.remote.app) successfully and enabled (10) out of (10) modules
```

### Load an App manually by starting a docker container using Docker CLI (dynamic)

#### Use Docker to run a container

```shell
$ docker run -t dockui-demo -d -p 8000:8080 dockui/demoapp start
[DockerLoader] Detected new running Docker container
[DockerLoader] Notify New Remote URL based App to load
[URLLoader] Request not authorized so Notify (New URL based App to build) request needs validation
[RequestGuardian] Request is correct but Permission hasnt yet been granted. Parking request until granted
```

> At this point its been detected but isnt loaded because it needs to be approved first

```shell
$ dockui app ls 2ce46c5e
Instance     App                   UUID         State                            Modules
-----------------------------------------------------------------------------------------
2ce46c5e     Demo App              4c3fe6ce     UnLoaded (Awaiting Approval)     5
```

#### Approve the App load request

```shell
$ docker app approve --permission read 4c3fe6ce
[CLI] Notify (Approve request for App 4c3fe6ce) request needs validation
[RequestGuardian] Request is cached for this approval and Permission was explicitly granted by CLI
[RequestGuardian] Notify New URL based App to build and cache validation result
[URLLoader] Detected new App URL load request for http://localhost:31245/dockui.app.yml
[URLLoader] Request is authorized so continue
[URLLoader] Loaded App with key(demo.app) successfully and enabled (10) out of (10) modules
```

## App Descriptor and Modules

The App Descriptor can be either in JSON or YAML format. It describes information about the App and what it provides to give the installer a clue, lifecyle callbacks for the framework and App to setup secure communication and a list of the various Module types which the App is contributing to the overall Application.

See Reference here: [Descriptor Reference](src/app/dockui.app.yml)

## API

See API here: [API.md](API.md)

## TESTS

See TESTS here: [TESTS.md](TESTS.md)