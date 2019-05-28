const uuidv4 = require("uuid/v4");
const App = require("./App");
const Module = require("./module/Module");

jest.mock("./module/Module");

describe("App", function() {
  "use strict";

  beforeEach(function() {});

  afterEach(function() {});

  test("should be defined and loadable", function() {
    expect(App).not.toBeUndefined();
    expect(typeof App).toBe("function");
  });

  test("should have correct signature", function() {
    const app = new App();
    expect(typeof app.getKey).toBe("function");
    expect(typeof app.getName).toBe("function");
    expect(typeof app.getType).toBe("function");
    expect(typeof app.getUrl).toBe("function");
    expect(typeof app.getDescription).toBe("function");
    expect(typeof app.getVersion).toBe("function");
    expect(typeof app.getDescriptorVersion).toBe("function");
    expect(typeof app.getIcon).toBe("function");
    expect(typeof app.getBuild).toBe("function");
    expect(typeof app.getLifecycle).toBe("function");
    expect(typeof app.getAuthentication).toBe("function");
    expect(typeof app.getId).toBe("function");
    expect(typeof app.getPermission).toBe("function");
    expect(typeof app.getModules).toBe("function");
    expect(typeof app.isEnabled).toBe("function");
  });

  test("should allow intantiation with zero args", function() {
    expect(() => {
      new App();
    }).not.toThrow();
  });

  test("should serializ correctly", function() {
    const module1 = new Module();
    const module2 = new Module();
    const modules = [module1, module2];
    const serlializedModules = [module1.toJSON(), module2.toJSON()];
    const app = new App({
      modules: modules
    });
    const output = app.toJSON();
    expect(output.modules).toEqual(serlializedModules);
  });

  describe("Methods", function() {
    var mockApp;
    var mockApp2;
    const TEST_KEY = "testApp";
    const TEST_KEY2 = "testApp2";

    beforeEach(function() {
      const generateApp = key => {
        return new App({ key: key });
      };
      mockApp = generateApp(TEST_KEY);
      mockApp2 = generateApp(TEST_KEY2);
    });

    test("getKey should return correct key", function() {
      expect(mockApp.getKey()).toBe(TEST_KEY);
    });

    // Test getModules(predicate)
    test("should return filtered Array of modules via getModules", function() {
      const app = new App();
      app.modules = [{ key: "m1" }, { key: "m2" }, { key: "m3" }];
      expect(app.getModules().length).toBe(3);
      expect(
        app.getModules(m => {
          return m.key === "m2";
        }).length
      ).toBe(1);
    });

    // Test getModule(moduleKey)
    test("should return correct single Module", function() {
      // const SINGLEKEY = "test.single.key";
      // const app = new App();
      // app.modules = [{ key: "m1" }, { key: SINGLEKEY }, { key: "m3" }];
      // expect(app.getModule(SINGLEKEY).getKey()).toBe(SINGLEKEY);
    });

    // Test enable()
    test("calling enable/disable should toggle isEnabled", function() {
      // const app = new App();
      // expect(app.isEnabled()).toBe(false);
      // app.enable();
      // expect(app.isEnabled()).toBe(true);
      // app.disable();
      // expect(app.isEnabled()).toBe(false);
    });
  });
});
