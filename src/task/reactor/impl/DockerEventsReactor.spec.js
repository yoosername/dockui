const DockerEventsReactor = require("./DockerEventsReactor");

describe("DockerEventsReactor", function() {
  "use strict";

  test("should be defined and a loadable function", function() {
    expect(DockerEventsReactor).not.toBeUndefined();
    expect(typeof DockerEventsReactor).toBe("function");
  });
});
