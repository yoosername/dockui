# DOCKUI

```shell
██████╗  ██████╗  ██████╗██╗  ██╗██╗   ██╗██╗
██╔══██╗██╔═══██╗██╔════╝██║ ██╔╝██║   ██║██║
██║  ██║██║   ██║██║     █████╔╝ ██║   ██║██║
██║  ██║██║   ██║██║     ██╔═██╗ ██║   ██║██║
██████╔╝╚██████╔╝╚██████╗██║  ██╗╚██████╔╝██║
╚═════╝  ╚═════╝  ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═
```

> Compose a single web experience from loosely coupled Docker based Apps

This is a **DRAFT** of a _work in progress_ and none of the commands below should be expected to work

## Quick Start

### Install the CLI

```bash
$ npm install -g https://github.com/yoosername/dockui.git
...
```

### Start a new framework instance (using default config)

```shell
$ dockui run
Starting - logging to STDOUT
...
Startup complete
...
```

If there wasnt already one found, this will create an instance config that looks like this

```yaml
---
store: file:./store.db
events: memory
port: 5000
secret: changeme
```

### Run a framework instance (using existing config)

#### (Option 1) Make sure a file called dockui.yml is in /etc/dockui then run

```shell
$ dockui run
...
```

#### (Option 2) Make sure you set required ENV vars as follows

```shell
$ DOCKUI_STORE=file:/tmp/store.db \
  DOCKUI_EVENTS=memory \
  DOCKUI_PORT=1234 \
  DOCKUI_SECRET=whatever \
  dockui run
...
```

### Stop a running framework instance

To end a running DockUI instance send a SIGTERM (e.g. Ctrl->C on Linux)

### Run DockUI as a daemon

DockUI is intended for running in the foreground in Docker Containers
however to run as daemon on a host you can use something like
[PM2](https://pm2.io/doc/en/runtime/overview/)

### List Loaded Apps

```shell
$ dockui apps

App                   UUID         State                            Permission
------------------------------------------------------------------------------
Demo Theme App        3cd6745f     Loaded (enabled)                 READ
Demo ReadOnly App     6ec43a77     Loaded (Awaiting Approval)       NONE
Demo Dynamic App      37fe3c2c     Loaded (disabled)                ADMIN
Demo Dynamic App2     c6cc4af6     Loading..........                NONE
```

### Loading Apps

There are two types of App **"static"** and **"dynamic"**.

#### Static Apps

These will be loaded once from URL and cached until unloaded or reloaded.

#### Dynamic Apps

- May require some processing steps if not already running
  - For example if loaded using Git Loader will
    - Clone Repo
    - Attach to build container
    - Run build steps specified in App descriptor
- Some modules will be cached based upon relevant cache policy

#### App Loaders

Apps can be loaded from a variety of locations through the use of AppLoaders. Built in ones include:

- Manually adding from local file
- Manually adding from remote URL
- Detection of Docker container using Docker events
- Built from Git Repo

These can all be triggered in a couple of ways:

- Manually using the **CLI**
- Remotely by an **App** using Management REST API with shared creds
  - Must have been loaded via the CLI
  - Must be approved & enabled
  - Must have been granted ADMIN permission

```shell
dockui apps load [--permission <permission> --auto-approve <instance>] <url>
```

### Load an App from a Github repo (dynamic)

```shell
$ dockui apps load --permission admin --auto-approve https://github/yoosername/dockui-app-nodejs-demo

[CLI] Notify New Git Repo App load request - await
[GitRepoAppLoader] Detected new Git based App load request
[GitRepoAppLoader] Cloning Dockui App https://github/yoosername/dockui-app-nodejs-demo to ~/.dockui/cache/3cd6745f
[GitRepoAppLoader] Cloned completed Successfully
[CLI] Detected Successfully completed Git Clone Request, notify new File App request
[FileLoader] Detected new file based App load request
[FileLoader] Parsing Dockui App descriptor ~/.dockui/cache/3cd6745f/dockui.app.yml
[FileLoader] Type is 'dynamic' so App will need to be build and run first
[FileLoader] Detected Build instructions in ~/.dockui/cache/3cd6745f/dockui.app.yml
[FileLoader] File load successfuly completed ( Build required )
[CLI] Detected partially completed File load Request, notify Build request
[Builder] App build requested using source dir (~/.dockui/cache/3cd6745f)
[Builder] Starting App(3cd6745f) build
[Builder] Running in sandbox attached to (~/.dockui/cache/3cd6745f)
[Builder] sandbox cmd: docker build --tag dockuidemo .
[Builder] sandbox cmd: docker run -t dockuidemo
[DockerLoader] Detected new running Docker container
[DockerLoader] Notify New URL based App load request
[URLLoader] Detected new App URL load request for http://localhost:31245/dockui.app.yml
[URLLoader] Loaded App with key(demo.app) successfully
[URLLoader] Notify Load complete
[LifecycleEventsStrategy] Detected Loaded App (Auto Approved via CLI)
[LifecycleEventsStrategy] Notify App Approval
[LifecycleEventsStrategy] Detected App Approval, enabled (10) out of (10) modules
```

### Load an App from a Github repo (static)

```shell
$ dockui apps load --permission write --auto-approve https://github/yoosername/dockui-app-static-demo

[CLI] Notify New Git based App load request
[GitRepoLoader] Detected new Git based App load request
[GitRepoLoader] Cloning Dockui App https://github/yoosername/dockui-app-static-demo to ~/.dockui/cache/4ce675ef
[GitRepoLoader] Notify new file based App load request
[FileLoader] Detected new file based App load request
[FileLoader] Parsing Dockui App descriptor ~/.dockui/cache/4ce675ef/dockui.app.yml
[FileLoader] Type is 'static' so App can be loaded directly.
[FileLoader] Loaded App with key(demo.static.app) successfully
[LifecycleEventsStrategy] Detected Loaded App (Auto Approved via CLI)
[LifecycleEventsStrategy] Notify App Approval
[LifecycleEventsStrategy] Detected App Approval, enabled (5) out of (5) modules
```

### Load an App from a Docker container image (dynamic)

```shell
$ dockui apps load --permission write --auto-approve dockui/demoapp

[CLI] Notify New Docker Image based App load request
[DockerLoader] Detected new Docker Image App load request
[DockerLoader] Attempting to start container using image dockui/demoapp
[DockerLoader] Detected new running Docker container
[DockerLoader] Notify new URL based App load request
[URLLoader] Detected new URL based App load request for http://localhost:31245/dockui.app.yml
[URLLoader] Loaded App with key(demo.app) successfully
[LifecycleEventsStrategy] Detected Loaded App (Auto Approved via CLI)
[LifecycleEventsStrategy] Notify App Approval
[LifecycleEventsStrategy] Detected App Approval, enabled (1) out of (1) modules
```

### Load an App from a remote URL (dynamic)

```shell
$ dockui apps load --permission read --auto-approve https://some.remote.url/dockui.app.yml

[CLI] Notify New URL based App load request
[URLLoader] Detected new URL based App load request for https://some.remote.url/dockui.app.yml
[URLLoader] Loaded App with key(demo.remote.app) successfully
[LifecycleEventsStrategy] Detected Loaded App (Auto Approved via CLI)
[LifecycleEventsStrategy] Notify App Approval
[LifecycleEventsStrategy] Detected App Approval, enabled (10) out of (10) modules
```

### Load an App manually by starting a docker container using Docker CLI (dynamic)

#### Use Docker to run a container

```shell
$ docker run -t dockui-demo -d -p 8000:8080 dockui/demoapp start

[DockerLoader] Detected new running Docker container
[DockerLoader] Notify New Remote URL based App load request
[URLLoader] Detected new URL based App load request for https://some.remote.url/dockui.app.yml
[URLLoader] Loaded App with key(demo.remote.app) successfully
[LifecycleEventsStrategy] Detected Loaded App (Not approved - skipping)
```

> At this point its been loaded but cant be enabled because it needs to be approved first

```shell
$ dockui apps

App          UUID         State                          Permission
-------------------------------------------------------------------
Demo App     4c3fe6ce     Loaded (Awaiting Approval)     NONE
```

#### Approve the App load request

```shell
dockui apps approve [--permission <permission>] <uuid>
```

```shell
$ dockui apps approve --permission read 4c3fe6ce

[CLI] Notify Approve request for App 4c3fe6ce
[LifecycleEventsStrategy] Detected App Approval, enabled (10) out of (10) modules
```

## App Descriptor and Modules

The App Descriptor can be either in JSON or YAML format. It describes information about the App and what it provides to give the installer a clue, lifecyle callbacks for the framework and App to setup secure communication and a list of the various Module types which the App is contributing to the overall Application.

See Reference here: [Descriptor Reference](src/app/dockui.app.yml)

## API

See API here: [API.md](API.md)

## TESTS

See TESTS here: [TESTS.md](TESTS.md)

## 12 Factor best practices to Keep in mind while I refactor!

### 1: Codebase

> One codebase tracked in revision control, many deploys

### 2: Dependencies

> Explicitly declare and isolate dependencies

### 3: Config

> Store config in the environment

### 4: Backing services

> Treat backing services as attached resources

### 5: Build, release, run

> Strictly separate build and run stages

### 6: Processes

> Execute the app as one or more stateless processes

### 7: Port binding

> Export services via port binding

### 8: Concurrency

> Scale out via the process model

### 9: Disposability

> Maximize robustness with fast startup and graceful shutdown

### 10: Dev/prod parity

> Keep development, staging, and production as similar as possible

### 11: Logs

> Treat logs as event streams

### 12: Admin processes

> Run admin/management tasks as one-off processes
