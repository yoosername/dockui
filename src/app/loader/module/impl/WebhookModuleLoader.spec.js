const WebhookModuleLoader = require("./WebhookModuleLoader");
const Module = require("../../../module/Module");
const WebhookModule = require("../../../module/impl/WebhookModule");
const ModuleLoader = require("../ModuleLoader");

describe("WebhookModuleLoader", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and loadable", function() {
    expect(WebhookModuleLoader).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof WebhookModuleLoader).toBe("function");
    expect(() => {
      new WebhookModuleLoader();
    }).not.toThrow();
    expect(new WebhookModuleLoader()).toBeInstanceOf(ModuleLoader);
  });

  test("should load an instance of Module & WebhookModule with correct signature", async () => {
    const loader = new WebhookModuleLoader();
    expect(typeof loader.canLoadModuleDescriptor).toBe("function");
    expect(typeof loader.loadModuleFromDescriptor).toBe("function");
    const canLoad = loader.canLoadModuleDescriptor({
      type: WebhookModule.DESCRIPTOR_TYPE
    });
    expect(canLoad).toEqual(true);
    const module = await loader.loadModuleFromDescriptor({
      type: WebhookModule.DESCRIPTOR_TYPE,
      url: "fakeURL"
    });
    expect(module.getUrl()).toEqual("fakeURL");
    expect(module instanceof Module).toEqual(true);
    expect(module instanceof WebhookModule).toEqual(true);
  });
});
