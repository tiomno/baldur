'use strict';
const should = require('should');

describe('Action: status', function() {
    before(bootstrap.init);
    after(bootstrap.teardown);

    it('should show status info', function(done) {
        api.specHelper.runAction('status', function(response) {
            response.nodeStatus.should.be.equal('Node Healthy');
            response.id.should.be.a.String();
            response.consumedMemoryMB.should.be.a.Number();
            response.eventLoopDelay.should.be.a.Number();

            response.serverInformation.should.be.an.Object();
            response.serverInformation.should.have.property('serverName');
            response.serverInformation.should.have.property('apiVersion');

            response.requesterInformation.should.be.an.Object();
            response.requesterInformation.should.have.property('id').which.is.a.String();
            response.requesterInformation.should.have.property('remoteIP').which.is.equal('testServer');

            response.requesterInformation.receivedParams.should.be.an.Object();
            response.requesterInformation.receivedParams.should.have.property('action').which.is.equal('status');
            response.requesterInformation.receivedParams.should.have.property('apiVersion').which.is.a.String();

            done();
        });
    });
});
