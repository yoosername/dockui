const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const {MockEventService} = require("../util/mocks");
var mockEventService = null;
var AppStore = require('./AppStore');

describe('AppStore', function() {
    "use strict";

    beforeEach(function(){
      mockEventService = new MockEventService();
    });

    it('should be defined and loadable', function() {
      expect(AppStore).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(AppStore).to.be.a('function');
      expect(()=>{
        new AppStore(mockEventService);
      }).to.not.throw();
    });

    it('should have correct signature', function() {
      const store = new AppStore(mockEventService);
      expect(store.get).to.be.a('function');
      expect(store.set).to.be.a('function');
      expect(store.delete).to.be.a('function');
    });

    it('should log a warning if you dont extend the default behaviour', function() {
      var logSpy = sinon.stub(console,"warn");
      const store = new AppStore(mockEventService);
      expect(store.get).to.be.a('function');
      expect(store.set).to.be.a('function');
      expect(store.delete).to.be.a('function');
      store.get();
      expect(logSpy).to.be.called.callCount(1);
      logSpy.restore();
    });

});
