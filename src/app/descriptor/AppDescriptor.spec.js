var AppDescriptor = require("./AppDescriptor");

describe("AppDescriptor", function() {
  "use strict";

  beforeEach(function() {});

  test("should be defined and loadable", function() {
    expect(AppDescriptor).not.toBeUndefined();
  });

  test("should be a function", function() {
    expect(typeof AppDescriptor).toBe("function");
  });

  test("should validate a correct JSON obj", function() {
    expect(() => {
      new AppDescriptor();
    }).toThrow();

    expect(() => {
      new AppDescriptor(null, null, null);
    }).toThrow();

    expect(() => {
      new AppDescriptor(undefined, "", false);
    }).toThrow();

    expect(() => {
      new AppDescriptor({
        key: "AppKey",
        url: "http://bla.bla"
      });
    }).toThrow();

    expect(() => {
      new AppDescriptor({
        key: "AppKey",
        url: "http://bla.bla",
        lifecycle: {
          loaded: "/myurl"
        },
        authentication: {
          type: "jwt"
        }
      });
    }).not.toThrow();
  });

  // Methods to Test
});
