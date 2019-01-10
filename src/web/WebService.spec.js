const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const  {
  WEBSERVICE_STARTING_EVENT,
  WEBSERVICE_STARTED_EVENT,
  WEBSERVICE_SHUTTING_DOWN_EVENT,
  WEBSERVICE_SHUTDOWN_EVENT
} = require("../constants/events"); 

const {MockEventService} = require("../util/mocks");
var mockEventService = null;
var WebService = require('./WebService');

describe('WebService', function() {
    "use strict";

    beforeEach(function(){
      mockEventService = new MockEventService();
    });

    it('should be defined and loadable', function() {
      expect(WebService).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(WebService).to.be.a('function');
    });

    it('should know if its running or not', function() {
      const web = new WebService(mockEventService);
      expect(web.isRunning()).to.equal(false);
      web.start();
      expect(web.isRunning()).to.equal(true);
      web.shutdown();
      expect(web.isRunning()).to.equal(false);
    });

    it('should fire start and stop events', function() {
      const spy = sinon.spy(mockEventService, "emit");
      const web = new WebService(mockEventService);
      web.start();
      expect(spy.calledTwice).to.equal(true);
    });

    // Add middleware (like a servlet filter)
    // Can we add some middleware and then fire a fake request through and see
    // if it is fired.
    // Remove middleware
    // Add handler
    // Remove handler

});
