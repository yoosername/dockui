# DOCKUI

```shell
██████╗  ██████╗  ██████╗██╗  ██╗██╗   ██╗██╗
██╔══██╗██╔═══██╗██╔════╝██║ ██╔╝██║   ██║██║
██║  ██║██║   ██║██║     █████╔╝ ██║   ██║██║
██║  ██║██║   ██║██║     ██╔═██╗ ██║   ██║██║
██████╔╝╚██████╔╝╚██████╗██║  ██╗╚██████╔╝██║
╚═════╝  ╚═════╝  ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═
```

> Build a Pluggable Web Experience from multiple Docker Based Micro Apps

This is an experiment and has no formal support. Feel free to fork it for your own use. There are plenty of READMEs and tests amongst the source code to give an idea of whats going on.

## Quick start (Docker)

### Build Local Development Image

```shell
$ git clone https://github.com/yoosername/dockui.git
$ cd dockui
$ npm install
$ docker build --tag dockui/framework .
```

### Start a new framework instance (in DEV_MODE using Nodemon and persistant db with LokiJS)

```shell
$ docker run -it \
  --env DOCKUI_WEB_PORT=3000 \
  --env DOCKUI_STORE_TYPE=lokijs \
  --env DOCKUI_STORE_DB_FILENAME=/app/loki.db \
  -p 3000:3000 \
  -v $(pwd):/app \
  -v /var/run/docker.sock:/var/run/docker.sock \
  dockui/framework
...
To connect a CLI to this instance first run:
        export DOCKUI_INSTANCE=http://localhost:3000
...
```

## Quick start (Host)

### Install the CLI

```shell
npm install -g https://github.com/yoosername/dockui.git
```

### Start a new framework instance (using default Config and in memory DB)

```shell
$ dockui run
...
[    INFO][2019-07-16T18:50:45.590Z][..........AppService] : App Service has started
[    INFO][2019-07-16T18:50:45.595Z][.........TaskManager] : Task Manager has started
[    INFO][2019-07-16T18:50:45.631Z][..........WebService] : Web Service has started at http://localhost:8080/
[    INFO][2019-07-16T18:50:45.631Z][..........WebService] :

            To connect a CLI to this instance first run:

                export DOCKUI_INSTANCE=http://localhost:8080
...
```

### Stop a running framework instance

To end a running DockUI instance send a SIGTERM (e.g. Ctrl->C on Linux)

### Run DockUI as a daemon

DockUI is intended for running in the foreground in Docker Containers
however to run as daemon on a host you can use something like
[PM2](https://pm2.io/doc/en/runtime/overview/)

## Configure and use CLI

### Point it at a running instance

The output from the run command gives you the env var required to point the CLI at a particular instance
For example:

```shell
export DOCKUI_INSTANCE=http://localhost:3000
```

### (Optional) - If using SSL & Self Signed Certs Turn off verification

```shell
export NODE_TLS_REJECT_UNAUTHORIZED=0
```

### List Loaded Apps

```shell
$ dockui ls
┌──────────────────────┬──────────────┬──────────────────────┬─────────┬────────────┐
│ App                  │ Id           │ Key                  │ Enabled │ Permission │
├──────────────────────┼──────────────┼──────────────────────┼─────────┼────────────┤
│ DockUI Dashboard App │ ce4bfd7dd549 │ dockui.dashboard.app │ true    │ admin      │
└──────────────────────┴──────────────┴──────────────────────┴─────────┴────────────┘
```

### Loading Apps

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
$ dockui load --permission admin http://localhost:3000/demo/demo.app.yml
ce4bfd7dd549bf16a1705ab5a221609d8cd67a5264cc3ce467dc443ce1701108
```

### Load an App from a Github repo (dynamic) [not implemented yet!!!]

```shell
$ dockui load --permission read https://github/yoosername/dockui-app-nodejs-demo
...
```

### Load an App from a Docker container image (dynamic) [not implemented yet!!!]

```shell
$ dockui load --permission write dockui/demoapp
...
```

### Load an App manually by starting a docker container using Docker CLI

#### Use Docker to run a container ( For example NGINX static )

```shell
$ docker run -it --label DOCKUI_APP=true -v $(pwd)/src/web/impl/static/demo:/usr/share/nginx/html:ro -p 1234:80 --network dockui --label DOCKUI_DESCRIPTOR=demo.app.yml nginx/nginx/html:ro -p 1234:80 nginx
```

> At this point in the logs for the instance you should see the loading occur

## Enable Apps

> Use the hash of the previously loaded app as the argument to this command

```shell
$ dockui enable ce4bfd7dd549
```

Now you can visit http://localhost:3000 to see the loaded app and the modules it provides

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
