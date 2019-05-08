var AppPermission = require("./AppPermission");

describe("AppPermission", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and loadable", function() {
    expect(AppPermission).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof AppPermission).toBe("object");
  });

  test("should only contain READ,WRITE,ADMIN", function() {
    expect(typeof AppPermission.READ).toBe("string");
    expect(AppPermission.READ).toBe("READ");
    expect(typeof AppPermission.WRITE).toBe("string");
    expect(AppPermission.WRITE).toBe("WRITE");
    expect(typeof AppPermission.ADMIN).toBe("string");
    expect(AppPermission.ADMIN).toBe("ADMIN");

    expect(Object.keys(AppPermission).length).toBe(3);
  });
});
