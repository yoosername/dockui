const ModuleFactory = require("./ModuleFactory");
const Module = require("../Module");
const ApiModule = require("../impl/ApiModule");
const AuthenticationProviderModule = require("../impl/AuthenticationProviderModule");
const AuthorizationProviderModule = require("../impl/AuthorizationProviderModule");
const RouteModule = require("../impl/RouteModule");
const WebFragmentModule = require("../impl/WebFragmentModule");
const WebHookModule = require("../impl/WebHookModule");
const WebItemModule = require("../impl/WebItemModule");
const WebPageModule = require("../impl/WebPageModule");
const WebResourceModule = require("../impl/WebResourceModule");

describe("ModuleFactory", function() {
  "use strict";

  test("create should return an instance of Module", function() {
    const module = ModuleFactory.create();
    expect(module).not.toBeUndefined();
    expect(typeof module).toBe("object");
    expect(module instanceof Module).toBe(true);
  });

  test("create should return correct instance types", function() {
    let module = ModuleFactory.create({
      module: { type: ApiModule.DESCRIPTOR_TYPE }
    });
    expect(module instanceof ApiModule).toBe(true);
    module = ModuleFactory.create({
      module: { type: AuthenticationProviderModule.DESCRIPTOR_TYPE }
    });
    expect(module instanceof AuthenticationProviderModule).toBe(true);
    module = ModuleFactory.create({
      module: { type: AuthorizationProviderModule.DESCRIPTOR_TYPE }
    });
    expect(module instanceof AuthorizationProviderModule).toBe(true);
    module = ModuleFactory.create({
      module: { type: RouteModule.DESCRIPTOR_TYPE }
    });
    expect(module instanceof RouteModule).toBe(true);
    module = ModuleFactory.create({
      module: { type: WebFragmentModule.DESCRIPTOR_TYPE }
    });
    expect(module instanceof WebFragmentModule).toBe(true);
    module = ModuleFactory.create({
      module: { type: WebHookModule.DESCRIPTOR_TYPE }
    });
    expect(module instanceof WebHookModule).toBe(true);
    module = ModuleFactory.create({
      module: { type: WebItemModule.DESCRIPTOR_TYPE }
    });
    expect(module instanceof WebItemModule).toBe(true);
    module = ModuleFactory.create({
      module: { type: WebPageModule.DESCRIPTOR_TYPE }
    });
    expect(module instanceof WebPageModule).toBe(true);
    module = ModuleFactory.create({
      module: { type: WebResourceModule.DESCRIPTOR_TYPE }
    });
    expect(module instanceof WebResourceModule).toBe(true);
  });
});
