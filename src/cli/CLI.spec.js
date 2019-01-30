const chai = require("chai");
const expect = chai.expect;

var CLI = require('./CLI');

describe('CLI', function() {
    "use strict";

    beforeEach(function(){
     
    });

    it('should be defined and loadable', function() {
      expect(CLI).to.not.be.undefined;
    });

    it('should be a function', function() {
      expect(CLI).to.be.a('function');
    });

    // TODO: These tests
    // Should produce usage when --help is specified
    
    // Generic Tests
    // Should accept a Config in its constructor.
    // Should override Config values with ENV values
    // Should override ENV values with Arguments
    // should provide defaults where missing in config
    // Should require a minimum amount of data in the Config and Warn if missing

    // Commands to test
    // (1) Run a specific framework instance
    //     dockui run [<instance> --config <configPath> -fg]

    // (2) List all instances and state 
    //     dockui ls [<instance> --config <configPath>]
    // Example:
    // Instance     Pid       App                   UUID         State                            Permission
    // ------------------------------------------------------------------------------------------------------
    // prod         34982     Demo Theme App        3cd6745f     Loaded (enabled)                 READ
    // prod         34982     Demo ReadOnly App     6ec43a77     Loaded (Awaiting Approval)       NONE
    // ref          32432     Demo Dynamic App      37fe3c2c     Loaded (disabled)                ADMIN
    // ref          32432     Demo Dynamic App2     c6cc4af6     Loading..........                NONE

    // (3) Load an App into a running instance\
    //     dockui app load [--permission <permission> --config <configPath> --auto-approve <instance>] <url>

    // (4) Approve a Loaded APp which is awaiting Approval:
    //     dockui app approve [--permission <permission>] <uuid>

    // (5) Stop a running DockUI instance
    //     dockui stop [<instance> --config <configPath> -fg]

});