var AppLoader = require("./AppLoader");
var ModuleLoader = require("./module/ModuleLoader");
var Module = require("../module/Module");
var App = require("../App");

const TEST_APP_DESCRIPTOR = {
  name: "DockUI Demo App",
  url: "https://dockui.demo/app",
  key: "dockui-unique-demo-app-key",
  description:
    "This is a demo App showing of the various features of the DockUI framework",
  version: "1.0.0",
  "descriptor-version": "1.0.0",
  icon: "/static/logo.png",
  build: ["docker build --tag dockuidemo .", "docker run -t dockuidemo"],
  lifecycle: {
    loaded: "/loaded"
  },
  authentication: {
    type: "jwt"
  },
  modules: [
    {
      type: "testModuleType1",
      arbritraryKey1: "arbritraryValue1"
    },
    {
      type: "testModuleType1",
      arbritraryKey1: "arbritraryValue1"
    },
    {
      type: "testModuleType2",
      arbritraryKey2: "arbritraryValue2"
    }
  ]
};

class TestModuleLoader1 extends ModuleLoader {
  canLoadModuleDescriptor(descriptor) {
    return descriptor.type === "testModuleType1";
  }
  loadModuleFromDescriptor(descriptor) {
    return new Module();
  }
}

class TestModuleLoader2 extends ModuleLoader {
  canLoadModuleDescriptor(descriptor) {
    return descriptor.type === "testModuleType2";
  }
  loadModuleFromDescriptor(descriptor) {
    return new Module();
  }
}

describe("AppLoader", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and a loadable function", function() {
    expect(AppLoader).not.toBeUndefined();
    expect(typeof AppLoader).toBe("function");
  });

  // Should Load a Descriptor file from URL
  test("should Load a Descriptor file from URL", async () => {
    const appLoader = new AppLoader().build();
    const TEST_URL = "http://some.url";
    const returnedApp = new App();
    const testFetcher = jest.fn().mockResolvedValue(returnedApp);
    const permission = App.permissions.READ;
    const app = await appLoader.load({
      url: TEST_URL,
      permission: permission,
      fetcher: testFetcher
    });
    expect(app instanceof App).toBe(true);
    expect(app.getKey()).toBe(returnedApp.getKey());
    expect(app.getDescription()).toBe(returnedApp.getDescription());
  });

  // App should have as many modules as valid ModuleLoaders
  test("should have as many modules as valid ModuleLoaders", async () => {
    const appLoader = new AppLoader()
      .withModuleLoader(new TestModuleLoader1())
      .withModuleLoader(new TestModuleLoader2())
      .build();
    const TEST_URL = "http://some.url";
    const testFetcher = jest.fn().mockResolvedValue(TEST_APP_DESCRIPTOR);
    const permission = App.permissions.READ;
    const app = await appLoader.load({
      url: TEST_URL,
      permission,
      fetcher: testFetcher
    });
    expect(app.getModules().length).toBe(3);
  });

  // Performing Security Handshake
  // Resolves with the loaded App object
});
