const Reactor = require("./Reactor");

describe("Reactor", function() {
  "use strict";

  test("should be defined and a loadable function", function() {
    expect(Reactor).not.toBeUndefined();
    expect(typeof Reactor).toBe("function");
  });
});
