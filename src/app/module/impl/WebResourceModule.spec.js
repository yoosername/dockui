const uuidv4 = require("uuid/v4");
const WebResourceModule = require("./WebResourceModule");

describe("WebResourceModule", function() {
  "use strict";

  beforeEach(function() {});

  afterEach(function() {});

  test("should be defined and loadable", function() {
    expect(WebResourceModule).not.toBeUndefined();
    expect(typeof WebResourceModule).toBe("function");
  });

  test("should have correct signature", function() {
    const module = new WebResourceModule();
    expect(typeof module.getId).toBe("function");
    expect(typeof module.getKey).toBe("function");
    expect(typeof module.getUrl).toBe("function");
    expect(typeof module.getResources).toBe("function");
    expect(typeof module.getContext).toBe("function");
    expect(typeof module.getWeight).toBe("function");
  });
});
