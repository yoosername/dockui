const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const LifecycleEventsStrategy = require("./LifecycleEventsStrategy");
var mockAppService = null;
var mockAppStore = null;
var mockEventService = null;

describe('LifecycleEventsStrategy', function() {
    "use strict";

    beforeEach(function(){
        mockAppService = { 
            "start": function () {},
            "shutdown": function () {},
            "scanForNewApps": function () {},
            "stopScanningForNewApps": function () {},
            "getApps": function () {},
            "getApp": function () {},
            "enableApp": function () {},
            "disableApp": function () {},
            "getAppModules": function () {},
            "getAppModule": function () {},
            "enableAppModule": function () {},
            "disableAppModule": function () {}
        };
        mockEventService = { 
            on: function () {}, 
            trigger: function () {}, 
            addListener: function(){},
            removeListener: function () {} 
        };
        mockAppStore = { 
            get: function () {}, 
            set: function () {},
            enableApp: function(){},
            disableApp: function(){},
            enableAppModule: function(){},
            disableAppModule: function(){}
        };
    });

    it('should be defined and loadable', function() {
        expect(LifecycleEventsStrategy).to.not.be.undefined;
    });

    it('should be a function', function() {
        expect(LifecycleEventsStrategy).to.be.a('function');
    });

    it('should throw if incorrect or missing args', function() {
        expect(function(){
            new LifecycleEventsStrategy();
        }).to.throw();
        expect(function(){
            new LifecycleEventsStrategy("","","");
        }).to.throw();
        expect(function(){
            new LifecycleEventsStrategy(null,null,null);
        }).to.throw();
        expect(function(){
            new LifecycleEventsStrategy(undefined,undefined,undefined);
        }).to.throw();
        expect(function(){
            new LifecycleEventsStrategy({},{},{});
        }).to.throw();
        expect(function(){
            new LifecycleEventsStrategy({
                get: {}, set: {}
            },{},{});
        }).to.throw();
        expect(function(){
            new LifecycleEventsStrategy(
                mockEventService,
                mockAppStore
            );
        }).to.not.throw();
    });

    it('should attach and detach 3 events listeners on setup and teardown', function() {
        var eventsSpy = sinon.spy(mockEventService,"on");
        
        var lifecycleEventsStrategy = new LifecycleEventsStrategy(
            mockEventService,
            mockAppStore
        );
        lifecycleEventsStrategy.setup();
        lifecycleEventsStrategy.teardown();
        
        expect(eventsSpy).to.be.calledThrice;
    });
    // Test that when we setup then teardown
    // 3 listeners are added, then 3 removed


});
