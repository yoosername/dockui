var AppLoader = require("./AppLoader");

describe("AppLoader", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and a loadable function", function() {
    expect(AppLoader).not.toBeUndefined();
    expect(typeof AppLoader).toBe("function");
  });
});
