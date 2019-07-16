const WebItemModule = require("./WebItemModule");

describe("WebItemModule", function() {
  "use strict";

  beforeEach(function() {});

  afterEach(function() {});

  test("should be defined and loadable", function() {
    expect(WebItemModule).not.toBeUndefined();
    expect(typeof WebItemModule).toBe("function");
  });

  test("should have correct signature", function() {
    const module = new WebItemModule();
    // From Module
    expect(typeof module.getId).toBe("function");
    expect(typeof module.getKey).toBe("function");
    // From WebItem
    expect(typeof module.getUrl).toBe("function");
    expect(typeof module.getText).toBe("function");
    expect(typeof module.getLocation).toBe("function");
    expect(typeof module.getTooltip).toBe("function");
    expect(typeof module.getWeight).toBe("function");
  });
});
