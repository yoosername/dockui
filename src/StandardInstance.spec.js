const StandardInstance = require("./StandardInstance");

describe("StandardInstance", function() {
  beforeEach(function() {});

  test("it is defined and loadable", () => {
    expect(StandardInstance).toBeDefined();
    expect(typeof StandardInstance).toBe("function");
  });
});
