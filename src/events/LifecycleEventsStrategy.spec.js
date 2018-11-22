const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const LifecycleEventsStrategy = require("./LifecycleEventsStrategy");
var mockPluginService = null;
var mockPluginStore = null;
var mockEventService = null;

describe('LifecycleEventsStrategy', function() {
    "use strict";

    beforeEach(function(){
        mockPluginService = { 
            "start": function () {},
            "shutdown": function () {},
            "scanForNewPlugins": function () {},
            "stopScanningForNewPlugins": function () {},
            "getPlugins": function () {},
            "getPlugin": function () {},
            "enablePlugin": function () {},
            "disablePlugin": function () {},
            "getPluginModules": function () {},
            "getPluginModule": function () {},
            "enablePluginModule": function () {},
            "disablePluginModule": function () {}
        };
        mockEventService = { 
            on: function () {}, 
            trigger: function () {}, 
            addListener: function(){},
            removeListener: function () {} 
        };
        mockPluginStore = { 
            get: function () {}, 
            set: function () {},
            enablePlugin: function(){},
            disablePlugin: function(){},
            enablePluginModule: function(){},
            disablePluginModule: function(){}
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
                mockPluginService,
                mockEventService,
                mockPluginStore
            );
        }).to.not.throw();
    });

    it('should attach and detach 3 events listeners on setup and teardown', function() {
        var eventsSpy = sinon.spy(mockEventService,"on");
        
        var lifecycleEventsStrategy = new LifecycleEventsStrategy(
            mockPluginService,
            mockEventService,
            mockPluginStore
        );
        lifecycleEventsStrategy.setup();
        lifecycleEventsStrategy.teardown();
        
        expect(eventsSpy).to.be.calledThrice;
    });
    // Test that when we setup then teardown
    // 3 listeners are added, then 3 removed


});
