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

const {MockEventService, MockAppService} = require("../util/mocks");
var mockEventService = null;
var mockAppService = null;
var WebService = require('./WebService');

describe('WebService', function() {
    "use strict";

    beforeEach(function(){
      mockAppService = new MockAppService();
      mockEventService = new MockEventService();
    });

    it('should be defined and loadable', function() {
      expect(WebService).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(WebService).to.be.a('function');
    });

    it('should know if its running or not', function() {
      const web = new WebService(mockAppService,mockEventService);
      expect(web.isRunning()).to.equal(false);
      web.start();
      expect(web.isRunning()).to.equal(true);
      web.shutdown();
      expect(web.isRunning()).to.equal(false);
    });

    it('should fire start and stop events', function() {
      const spy = sinon.spy(mockEventService, "emit");
      const web = new WebService(mockAppService,mockEventService);
      web.start();
      expect(spy.calledTwice).to.equal(true);
    });

    // TODO: Test the following:
    //        Add a route for Management Rest API ( Takes precendence over Apps provided route of same name )
    //        List All Apps - GET /rest/admin/apps
    //        Attempt to Load App - POST /rest/admin/apps {url: "https:/location.of/descriptor.yml", permission: "READ"} - returns new App URI
    //        Get single App - GET /rest/admin/apps/{appKey}||{appUUID}
    //        Reload App (or change Permission) - PUT /rest/admin/apps/{appKey}||{appUUID} {url: "https:/location.of/descriptor.yml", permission: "READ"}
    //        Unload App - DELETE /rest/admin/apps/{appKey}||{appUUID}
    //        List Apps Modules - GET/POST /rest/admin/apps/{appKey}||{appUUID}/modules
    //        Enable App - GET/POST /rest/admin/apps/{appKey}||{appUUID}/enable
    //        Disable App - GET/POST /rest/admin/apps/{appKey}||{appUUID}/disable
    //        Enable Module - GET/POST /rest/admin/apps/{appKey}||{appUUID}/modules/{moduleKey}/enable
    //        Disable Module - GET/POST /rest/admin/apps/{appKey}||{appUUID}/modules/{moduleKey}/disable

});
