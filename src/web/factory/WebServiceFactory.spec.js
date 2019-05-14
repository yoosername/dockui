const WebServiceFactory = require("./WebServiceFactory");

describe("WebServiceFactory", function() {
  "use strict";

  beforeEach(function() {});

  it("should be defined and a loadable function", function() {
    expect(WebServiceFactory).not.toBeUndefined();
    expect(typeof WebServiceFactory).toBe("object");
    expect(typeof WebServiceFactory.create).toBe("function");
  });

  it("should return a valid WebService instance with or without config", function() {
    const webService = WebServiceFactory.create();
    expect(typeof webService).toBe("function");
  });
});
