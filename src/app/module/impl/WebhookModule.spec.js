const WebhookModule = require("./WebhookModule");

describe("WebhookModule", function() {
  "use strict";

  beforeEach(function() {});

  afterEach(function() {});

  test("should be defined and loadable", function() {
    expect(WebhookModule).not.toBeUndefined();
    expect(typeof WebhookModule).toBe("function");
  });

  test("should have correct signature", function() {
    const module = new WebhookModule();
    // From Module
    expect(typeof module.getId).toBe("function");
    expect(typeof module.getKey).toBe("function");
    // From Webhook
    expect(typeof module.getUrl).toBe("function");
    expect(typeof module.getEvents).toBe("function");
  });
});
