const expect = require('chai').expect;
const DockerService = require("./DockerService");
const EventEmitter = require("events");
const MISSING_EMITTER_ERROR = require("../constants").errors.MISSING_EMITTER_ERROR;

describe('DockerService', function() {
    "use strict";

    it('should be defined and loadable', function() {
        expect(DockerService).to.not.be.undefined;
    });

    it('should be a function', function() {
        expect(DockerService).to.be.a('function');
    });

    it('should be able to be used with or without the new operator', function() {
        var withNewOperator = new DockerService(new EventEmitter());
        expect(withNewOperator).to.be.an.instanceOf(DockerService);

        var withoutNewOperator = new DockerService(new EventEmitter());
        expect(withoutNewOperator).to.be.an.instanceOf(DockerService);
    });

    it('should be called with a instance of EventEmitter or throw an error', function() {
        expect(function(){DockerService();}).to.throw(Error, MISSING_EMITTER_ERROR);
    });



});
