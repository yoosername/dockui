const expect = require('chai').expect;

const EventService = require("./EventService");

describe('EventService', function() {
    "use strict";

    it('should be defined and loadable', function() {
        expect(EventService).to.not.be.undefined;
    });

    it('should be a function', function() {
        expect(EventService).to.be.a('function');
    });

    it('should be able to be used with or without the new operator', function() {
        var withNewOperator = new EventService();
        expect(withNewOperator).to.be.an.instanceOf(EventService);

        var withoutNewOperator = new EventService();
        expect(withoutNewOperator).to.be.an.instanceOf(EventService);
    });

    it('should emit an event when emit() is called with the correct payload', function(done) {

        const es = new EventService();
        const eventPayload = {
            action: "thing"
        };
        es.on("test:event", function(payload){
            expect(payload).to.eql(eventPayload);
            done();
        });
        es.emit("test:event", eventPayload);

    });

});
