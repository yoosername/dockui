const DockerEventsReactor = require("./DockerEventsReactor");

describe("DockerEventsReactor", function() {
  "use strict";

  test("should be defined and a loadable function", function() {
    expect(Reactor).not.toBeUndefined();
    expect(typeof Reactor).toBe("function");
  });
});
