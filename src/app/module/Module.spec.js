var Module = require("./Module");

const App = require("../App");
const ModuleDescriptor = require("../descriptor/ModuleDescriptor");

jest.mock("../App");
jest.mock("../descriptor/ModuleDescriptor");

var app,
  descriptor = null;

describe("Module", function() {
  "use strict";

  beforeEach(function() {
    app = new App();
    descriptor = new ModuleDescriptor();
    descriptor.getKey.mockReturnValue("testModuleKey");
    descriptor.getName.mockReturnValue("testModuleName");
    descriptor.getType.mockReturnValue("testModuleType");
  });

  test("should be defined and loadable", function() {
    expect(Module).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof Module).toBe("function");
  });

  test("should validate arguments", function() {
    expect(function() {
      new Module();
    }).toThrow();
    expect(function() {
      new Module(null, null, null);
    }).toThrow();
    expect(function() {
      new Module(undefined, undefined, undefined);
    }).toThrow();
    expect(function() {
      new Module(app, app, "");
    }).toThrow();
    expect(function() {
      new Module(app, descriptor);
    }).not.toThrow();
  });

  test("should respond with correct Key", function() {
    var module = new Module(app, descriptor);
    expect(module.getKey()).toBe("testModuleKey");
  });

  test("should respond with correct Name", function() {
    var module = new Module(app, descriptor);
    expect(module.getName()).toBe("testModuleName");
  });

  test("should respond with correct Type", function() {
    var module = new Module(app, descriptor);
    expect(module.getType()).toBe("testModuleType");
  });
});
