# DOCKUI

> Compose a single web experience from loosely coupled Docker based Apps

*Note: This is a draft and none of the commands below may yet work*

## Quick Start

### Start the framework

Use the CLI to generate a new dockui instance config in the current directory (generates dockui.yml)

```bash
mkdir ~/dockui-demo && cd ~/dockui-demo
sudo npm install -g @dockui/cli
```

Start an instance of the framework using the config in the current directory
Optionally run 'dockui start ./otherDir' or 'dockui start ./otherConfigFile.yml'
Defaults to running in the background as a daemon unless you use the -fg switch

```bash
dockui init
dockui start
Starting Dockui instance 2ce46c5e - Logs output to STDOUT
```

### List Loaded Apps

```bash
dockui app list
#> There are (0) Loaded Apps
```

### Load a Demo 'dynamic' App from a Github repo

```bash
dockui app install https://github/yoosername/dockui-app-nodejs-demo --permission admin -y
# [CLI] Notify New Git based App to load
# [GitRepoLoader] Detected new Git based App load request
# [GitRepoLoader] Cloning Dockui App https://github/yoosername/dockui-app-nodejs-demo to ~/.dockui/cache/3cd6745f
# [GitRepoLoader] Notify New filesystem based App to load
# [FileLoader] Detected new file based App load request
# [FileLoader] Parsing Dockui App descriptor ~/.dockui/cache/3cd6745f/dockui.app.yml
# [FileLoader] Type is 'dynamic' so App will need to be build and run first
# [FileLoader] Detected Build instructions in ~/.dockui/cache/3cd6745f/dockui.app.yml
# [FileLoader] Notify (New filesystem based App to build) request needs validation
# [RequestGuardian] Request is correct and Permission was explicitly granted by CLI
# [RequestGuardian] Notify New filesystem based App to build and cache validation result
# [BuilderLoader] App build requested for App(3cd6745f) from source dir (~/.dockui/cache/3cd6745f)
# [BuilderLoader] Starting App(3cd6745f) build
# [BuilderLoader] Running build sandbox attached to (~/.dockui/cache/3cd6745f)
# [BuilderLoader] sandbox cmd: docker build --tag dockuidemo .
# [BuilderLoader] sandbox cmd: docker run -t dockuidemo
# [DockerLoader] Detected new running Docker container
# [DockerLoader] Notify New Remote URL based App to load
# [URLLoader] Detected new App URL load request for http://localhost:31245/dockui.app.yml
# [URLLoader] Notify (New URL based App to build) request needs validation
# [RequestGuardian] Request validation is cached as authorised
# [RequestGuardian] Notify New URL based App to build
# [URLLoader] Loaded App with key(demo.app) successfully and enabled (10) out of (10) modules
```

### Load a Demo 'static' App from a Github repo

```bash
dockui app install https://github/yoosername/dockui-app-static-demo --permission write -y
# [CLI] Notify New Git based App to load
# [GitRepoLoader] Detected new Git based App load request
# [GitRepoLoader] Cloning Dockui App https://github/yoosername/dockui-app-static-demo to ~/.dockui/cache/4ce675ef
# [GitRepoLoader] Notify New filesystem based App to load
# [FileLoader] Detected new file based App load request
# [FileLoader] Parsing Dockui App descriptor ~/.dockui/cache/4ce675ef/dockui.app.yml
# [FileLoader] Type is 'static' so App can be loaded directly.
# [FileLoader] Notify (New filesystem based App to build) request needs validation
# [RequestGuardian] Request is correct and Permission was explicitly granted by CLI
# [RequestGuardian] Notify New filesystem based App to build and cache validation result
# [FileLoader] Loaded App with key(demo.static.app) successfully and enabled (5) out of (5) modules
```

### Load a Demo 'dynamic' App from a Docker container image
```bash
dockui app install dockui/demoapp --permission write -y
# [CLI] Notify New Docker Image based App to load
# [DockerLoader] Detected new Docker Image App load request
# [DockerLoader] Attempting to start container using image dockui/demoapp
# [DockerLoader] Detected new running Docker container
# [DockerLoader] Notify New Remote URL based App to load
# [URLLoader] Detected new App URL load request for http://localhost:31245/dockui.app.yml
# [URLLoader] Request not authorized so Notify (New URL based App to build) request needs validation
# [RequestGuardian] Request is correct and Permission was explicitly granted by CLI
# [RequestGuardian] Notify New URL based App to build and cache validation result
# [URLLoader] Request is authorized so continue
# [URLLoader] Loaded App with key(demo.app) successfully and enabled (10) out of (10) modules
```

### Load a Demo 'dynamic' App from a remote URL
```bash
dockui app install https://some.remote.url/dockui.app.yml --permission read -y
# [CLI] Notify New URL based App to load
# [URLLoader] Detected new App URL load request for https://some.remote.url/dockui.app.yml
# [URLLoader] Request not authorized so Notify (New URL based App to build) request needs validation
# [RequestGuardian] Request is correct and Permission was explicitly granted by CLI
# [RequestGuardian] Notify New URL based App to build and cache validation result
# [URLLoader] Request is authorized so continue
# [URLLoader] Loaded App with key(demo.remote.app) successfully and enabled (10) out of (10) modules
```

### Load a Demo 'dynamic' App manually by starting a docker container using Docker CLI
```bash
docker run -t dockui-demo -d -p 8000:8080 dockui/demoapp start
# [DockerLoader] Detected new running Docker container
# [DockerLoader] Notify New Remote URL based App to load
# [URLLoader] Request not authorized so Notify (New URL based App to build) request needs validation
# [RequestGuardian] Request is correct but Permission hasnt yet been granted. Parking request until granted
dockui app list
#> There are (0) Loaded Apps and (1) App awaiting approval
#> 4c3fe6ce, demo.app, "docker:dockui/demoapp", "awaiting approval"
docker app approve --permission read 4c3fe6ce
# [CLI] Notify (Approve request for App 4c3fe6ce) request needs validation
# [RequestGuardian] Request is cached for this approval and Permission was explicitly granted by CLI
# [RequestGuardian] Notify New URL based App to build and cache validation result
# [URLLoader] Detected new App URL load request for http://localhost:31245/dockui.app.yml
# [URLLoader] Request is authorized so continue
# [URLLoader] Loaded App with key(demo.app) successfully and enabled (10) out of (10) modules
```

## App Descriptor and Modules

The App Descriptor can be either in JSON or YAML format. It describes information about the App and what it provides to give the installer a clue, lifecyle callbacks for the framework and App to setup secure communication and a list of the various Module types which the App is contributing to the overall Application.

See Reference here: [Descriptor Reference](src/app/dockui.app.yml)

## API

See API here: [API.md](API.md)

## TESTS

See TESTS here: [TESTS.md](TESTS.md)