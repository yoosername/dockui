const chai = require("chai");
const expect = chai.expect;

var { Config, ConfigBuilder } = require("./Config");

describe("Config", function() {
  "use strict";

  beforeEach(function() {});

  it("should be defined and loadable", function() {
    expect(Config).to.not.be.undefined;
    expect(ConfigBuilder).to.not.be.undefined;
  });

  it("should be a function", function() {
    expect(Config).to.be.a("function");
    expect(ConfigBuilder).to.be.a("function");
  });

  it("Should return a Config.Builder if one isnt passed as arg", function() {
    var builder = new Config();
    expect(builder).to.be.instanceof(ConfigBuilder);
  });

  describe("ConfigBuilder", function() {
    // store
    it("should be able to set the store", function() {
      const config = new ConfigBuilder().withStore("file://local.file").build();
      expect(config.store).to.equal("file://local.file");
    });

    // events
    it("should be able to set the events", function() {
      const config = new ConfigBuilder().withEvents("memory").build();
      expect(config.events).to.equal("memory");
    });

    // port
    it("should be able to set the port", function() {
      const config = new ConfigBuilder().withPort("8000").build();
      expect(config.port).to.equal("8000");
    });

    // secret
    it("should be able to set the global secret", function() {
      const config = new ConfigBuilder().withSecret("changeme").build();
      expect(config.secret).to.equal("changeme");
    });
  });
});
