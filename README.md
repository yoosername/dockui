# DOCKUI (draft)

> Compose a single web experience from loosely coupled Docker based Apps

## Quick Start

Follow one of these guides below to start a Dockui Framework instance and then install an App which will demo most of the features:

### Quick Start (CLI)

#### From Scratch

```bash
mkdir ~/dockui-demo && cd ~/dockui-demo
npm install -g @dockui/dockui
dockui init
dockui start
dockui app install https://github/yoosername/dockui-app-nodejs-demo -y
cd dockui-app-nodejs-demo
# Edit ./static/index.html in your favorite editor and see immediate results @ https://localhost:8000/
```

#### Existing

```bash
cd ~/dockui-demo
dockui install
dockui start
# installs all apps listed in dockui.yml and then starts the framework container and all app containers
```

### Quick Start (Manually using Docker)

```bash
mkdir ~/dockui-demo && cd ~/dockui-demo
docker run -t dockui-demo -d -p 8000:8080 dockui/dockui start
git clone https://github/yoosername/dockui-app-nodejs-demo
cd dockui-app-nodejs-demo
docker build --tag dockui-app-nodejs-demo .
docker run -fg \
       -v $(pwd):/app -w /app\
       dockui-app-nodejs-demo\
       npm run startdev
# Edit ./static/index.html in your favorite editor and see immediate results @ http://localhost:8000/
```

## Manually add Framework + Apps using the generated API_KEY

```bash
docker run --tag dockui-demo-framework -d -p 8000:8080 dockui/dockui start
docker run --tag dockui-demo-authprovider -d dockui/demo-authprovider
docker run --tag dockui-demo-scopeprovider -d dockui/demo-scopeprovider
docker run --tag dockui-demo-route -d dockui/demo-route
docker run --tag dockui-demo-webpage-decorator -d dockui/demo-webpage-decorator
docker run --tag dockui-demo-webpage-decorated -d dockui/demo-webpage-decorated
docker run --tag dockui-demo-webfragment -d dockui/demo-webfragment
docker run --tag dockui-demo-webitem -d dockui/demo-webitem
docker run --tag dockui-demo-rest -d dockui/demo-rest
docker run --tag dockui-demo-resource -d dockui/demo-resource
```

You should now be able to visit <https://localhost:8000/> to see the above manually configured demo app. You probably wouldn't
split up your Apps like this, but the demo Apps are built this way to show how everything is combined seamlessly.

## App Descriptor and Modules

The App Descriptor can be either in JSON or YAML format. It describes information about the App and what it provides to give the installer a clue, lifecyle callbacks for the framework and App to setup secure communication and a list of the various Module types which the App is contributing to the overall Application.

See Reference here: [Descriptor Reference](src/app/dockui.app.yml)

## API

See API here: [API.md](src/API.md)

## TESTS

See TESTS here: [TESTS.md](src/TESTS.md)