# DOCKUI (draft)

> Compose a single web experience from loosely coupled Docker based Apps

## Quick Start

```bash
mkdir ~/dockui-demo && cd ~/dockui-demo
npm install -g @dockui/dockui
dockui init
dockui start
# Framework will now be served from https://localhost:8000/ but as there are no Apps serving at root context will display loading bar
dockui app install https://github/yoosername/dockui-app-nodejs-demo --permission admin -y
# This will automatically:
# - clone the repo
# - detect and parse the app.yml and try to load App from remote Url
# - If remote not detected then it will run the command in scripts/start
#   - This will load and start the docker container and subsequent webapp
# The framework will detect the container once it is up and running
# The framework will attempt to Load the App and grant it ADMIN permission
# Once loaded the App will use the framework managment API using its passed credentials to load all the Apps that form the Demo.
# When All the Apps are loaded https://localhost:8000/ will switch from a Loading bar to the WebPage provided by the App
```

### Quick Start (Manually using Docker Build)

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

### Quick Start (Manually using Docker Run)

```bash
docker run --tag dockui-demo-framework -d -p 8000:8080 dockui/dockui start
docker run --tag dockui-demo-authenticationprovider -d dockui/demo-authenticationprovider
docker run --tag dockui-demo-authorizationprovider -d dockui/demo-authorizationprovider
docker run --tag dockui-demo-route -d dockui/demo-route
docker run --tag dockui-demo-webpage-decorator -d dockui/demo-webpage-decorator
docker run --tag dockui-demo-webpage-decorated -d dockui/demo-webpage-decorated
docker run --tag dockui-demo-webfragment -d dockui/demo-webfragment
docker run --tag dockui-demo-webitem -d dockui/demo-webitem
docker run --tag dockui-demo-webresource -d dockui/demo-webresource
docker run --tag dockui-demo-api -d dockui/demo-api
docker run --tag dockui-demo-webhook -d dockui/demo-webhook
```

You should now be able to visit <https://localhost:8000/> to see the above manually configured demo app. You probably wouldn't
split up your Apps like this, but the demo Apps are built this way to show how everything is combined seamlessly.

## App Descriptor and Modules

The App Descriptor can be either in JSON or YAML format. It describes information about the App and what it provides to give the installer a clue, lifecyle callbacks for the framework and App to setup secure communication and a list of the various Module types which the App is contributing to the overall Application.

See Reference here: [Descriptor Reference](src/app/dockui.app.yml)

## API

See API here: [API.md](API.md)

## TESTS

See TESTS here: [TESTS.md](TESTS.md)