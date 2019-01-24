# DockUI

██████╗  ██████╗  ██████╗██╗  ██╗██╗   ██╗██╗
██╔══██╗██╔═══██╗██╔════╝██║ ██╔╝██║   ██║██║
██║  ██║██║   ██║██║     █████╔╝ ██║   ██║██║
██║  ██║██║   ██║██║     ██╔═██╗ ██║   ██║██║
██████╔╝╚██████╔╝╚██████╗██║  ██╗╚██████╔╝██║
╚═════╝  ╚═════╝  ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═

> Compose a single web experience from loosely coupled Docker based Apps

This is a **DRAFT** of a _work in progress_ and none of the commands below should be expected to work

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
* If -y flag present all of the defaults will be chosen
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

The **--config** option can be ignored if the config file is in the current directory
The **instance** argument can be ignored if a **_default_** is specified in the config

```shell
dockui run [<instance> --config <configPath> -fg]
```

```shell
$ dockui run
Running Dockui instance 2ce46c5e in daemon mode, forwarding logs to /var/log/dockui/2ce46c5e.log
```

### List Loaded Apps per instance

```shell
dockui ls [<instance> --config <configPath>]
```

```shell
$ dockui ls

Instance     Pid       App                   UUID         State                            Permission
------------------------------------------------------------------------------------------------------
prod         34982     Demo Theme App        3cd6745f     Loaded (enabled)                 READ
prod         34982     Demo ReadOnly App     6ec43a77     Loaded (Awaiting Approval)       NONE
ref          32432     Demo Dynamic App      37fe3c2c     Loaded (disabled)                ADMIN
ref          32432     Demo Dynamic App2     c6cc4af6     Loading..........                NONE
```

### Loading Apps

There are two types of App **"static"** and **"dynamic"**.

* Static Apps can be loaded directly from a URL or File and will be cached.
* Dynamic Apps may require some build steps if they are not already running
  * For example building and starting the respective docker image etc

```shell
dockui app load [--permission <permission> --config <configPath> --auto-approve <instance>] <url>
```

### Load an App from a Github repo (dynamic)

```shell
$ dockui app load --permission admin --auto-approve https://github/yoosername/dockui-app-nodejs-demo

[CLI] Notify New Git based App load request
[GitRepoLoader] Detected new Git based App load request
[GitRepoLoader] Cloning Dockui App https://github/yoosername/dockui-app-nodejs-demo to ~/.dockui/cache/3cd6745f
[GitRepoLoader] Notify New filesystem based App load request
[FileLoader] Detected new file based App load request
[FileLoader] Parsing Dockui App descriptor ~/.dockui/cache/3cd6745f/dockui.app.yml
[FileLoader] Type is 'dynamic' so App will need to be build and run first
[FileLoader] Detected Build instructions in ~/.dockui/cache/3cd6745f/dockui.app.yml
[FileLoader] Notify new build request
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
$ dockui app load --permission write --auto-approve https://github/yoosername/dockui-app-static-demo

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
$ dockui app load --permission write --auto-approve dockui/demoapp

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
$ dockui app load --permission read --auto-approve https://some.remote.url/dockui.app.yml

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
$ dockui ls prod

Instance     Pid       App          UUID         State                          Permission
------------------------------------------------------------------------------------------
prod         34982     Demo App     4c3fe6ce     Loaded (Awaiting Approval)     NONE
```

#### Approve the App load request

```shell
dockui app approve [--permission <permission>] <uuid>
```

```shell
$ dockui app approve --permission read 4c3fe6ce

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