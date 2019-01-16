const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var UrlAppLoader = require('./UrlAppLoader');

describe('UrlAppLoader', function() {
    "use strict";

    beforeEach(function(){
        
    });

    it('should be defined and loadable', function() {
        expect(UrlAppLoader).to.not.be.undefined;
    });

    it('should be a function', function() {
        expect(UrlAppLoader).to.be.a('function');
    });

// Methods to Test
// "scanForNewApps"
//   should find App Desriptor from valid Url and be able to Parse it
//   should send ErrorLoadingAppEvent when cant parse Descriptor
// "stopScanningForNewApps"
//   should be called after scanForNewApps runs to prevent repeat loads
// "getApps",
//   using 2 correct Descriptors should return 2 Apps with correct info
//   using 1 correct and 1 incorrect Descriptors should return 1 App with correct info

});