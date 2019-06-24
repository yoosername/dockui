const StandardInstance = require("./StandardInstance");
let supressLogger;

describe("StandardInstance", function() {
  beforeEach(function() {
    supressLogger = {};
    supressLogger.debug = jest.fn().mockImplementation(() => {});
    supressLogger.child = jest.fn().mockImplementation(() => {
      return supressLogger;
    });
  });

  test("it is defined and loadable", () => {
    expect(StandardInstance).toBeDefined();
    expect(typeof StandardInstance).toBe("function");
  });

  test("it produces a standard instance properly", () => {
    expect(() => {
      StandardInstance({ logger: supressLogger });
    }).not.toThrow();
  });
});
