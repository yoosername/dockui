var AppStore = require("./AppStore");

describe("AppStore", function() {
  "use strict";

  beforeEach(function() {});

  it("should be defined and loadable", function() {
    expect(AppStore).not.toBeUndefined();
  });

  it("should be a function", function() {
    expect(typeof AppStore).toBe("function");
    expect(() => {
      new AppStore();
    }).not.toThrow();
  });

  it("should have correct signature", function() {
    const store = new AppStore();
    expect(typeof store.create).toBe("function");
    expect(typeof store.read).toBe("function");
    expect(typeof store.update).toBe("function");
    expect(typeof store.delete).toBe("function");
    expect(typeof store.find).toBe("function");
  });

  it("should log a warning if you dont extend the default behaviour", function() {
    var logSpy = jest.spyOn(console, "warn").mockImplementation();
    const store = new AppStore();
    store.create();
    store.read();
    store.update();
    store.delete();
    store.find();
    expect(logSpy).toHaveBeenCalledTimes(5);
    logSpy.mockReset();
  });
});
