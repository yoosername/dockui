const WebServiceFactory = require("./WebServiceFactory");
const SimpleKoaWebService = require("../impl/SimpleKoaWebService");
const AppService = require("../../app/service/AppService");

jest.mock("../../app/service/AppService");

let config = {};
let appService = null;

describe("WebServiceFactory", function() {
  "use strict";

  beforeEach(function() {
    appService = new AppService();
    config.get = jest.fn().mockImplementation(() => {
      return "";
    });
  });

  test("should be defined and a loadable function", function() {
    expect(WebServiceFactory).not.toBeUndefined();
    expect(typeof WebServiceFactory).toBe("object");
    expect(typeof WebServiceFactory.create).toBe("function");
  });

  test("should return a valid WebService instance with or without config", function() {
    const webService = WebServiceFactory.create(appService);
    expect(typeof webService).toBe("object");
  });

  test("should return a SimpleWebService by default", function() {
    const webService = WebServiceFactory.create(appService, config);
    expect(webService instanceof SimpleKoaWebService).toBe(true);
  });
});
