const uuidv4 = require("uuid/v4");
const Module = require("./Module");

describe("Module", function() {
  "use strict";

  beforeEach(function() {});

  afterEach(function() {});

  test("should be defined and loadable", function() {
    expect(Module).not.toBeUndefined();
    expect(typeof Module).toBe("function");
  });

  test("should have correct signature", function() {
    const module = new Module();
    expect(typeof module.getId).toBe("function");
    expect(typeof module.getKey).toBe("function");
    expect(typeof module.getName).toBe("function");
    expect(typeof module.getDescription).toBe("function");
    expect(typeof module.getAliases).toBe("function");
    expect(typeof module.getType).toBe("function");
    expect(typeof module.isEnabled).toBe("function");
    expect(typeof module.getRoles).toBe("function");
    expect(typeof module.getCache).toBe("function");
    expect(typeof module.isCacheEnabled).toBe("function");
  });

  test("getKey should return correct key", function() {
    const model = {
      key: "testKey"
    };
    const module = new Module(model);
    expect(module.getKey()).toEqual(model.key);
  });

  // Test getModules(predicate)
  test("should return correct JSON when toJSON called", function() {
    const model = {
      cache: { policy: "disabled" },
      enabled: false,
      id: "0d4e56de-846c-4245-9489-0ec1bbe7f65a",
      key: "0d4e56de-846c-4245-9489-0ec1bbe7f65a",
      name: "0d4e56de-846c-4245-9489-0ec1bbe7f65a",
      description: "Test Description",
      aliases: [],
      roles: [],
      type: "generic",
      docType: Module.DOCTYPE,
      appId: null,
      auth: null
    };
    const module = new Module(model);
    expect(module.toJSON()).toEqual(model);
  });

  // Test getModules(predicate)
  test("should be able to set the ID", function() {
    const module = new Module();
    const moduleID = module.getId();
    const newModule = new Module(module.getJSON());
    expect(newModule.getId()).toEqual(moduleID);
  });
});
