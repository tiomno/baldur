'use strict';
const should = require('should');

describe('Action: schedule', function() {
    before(bootstrap.init);
    after(bootstrap.teardown);

    it('should show an error if the parameters are missing', function(done) {
        api.resetConnection();

        api.specHelper.runAction('schedule', api.testConnections.testConnection, function(response) {
            response.error.should.be.equal('The parameters of the request are not well formed.');
            response.messageCount.should.be.equal(1);

            done();
        });
    });

    it('should show an error if the appKey parameter does not match any app key in the DB', function(done) {
        api.resetConnection('siteId=1&appKey=wrong-key&signature=wrong-signature', {
            siteId: 1,
            appKey: 'wrong-key',
            signature: 'wrong-signature'
        });

        api.specHelper.runAction('schedule', api.testConnections.testConnection, function(response) {
            response.error.should.be.equal('No app matches the appKey provided.');
            response.messageCount.should.be.equal(1);

            done();
        });
    });

    it('should show an error if the signature is not well formed', function(done) {
        api.resetConnection('siteId=1&appKey=278d425bdf160c739803&signature=wrong-signature', {
            siteId: 1,
            appKey: '278d425bdf160c739803',
            signature: 'wrong-signature'
        });

        api.specHelper.runAction('schedule', api.testConnections.testConnection, function(response) {
            response.error.should.be.equal('The signature is not valid.');
            response.messageCount.should.be.equal(1);

            done();
        });
    });

    it('should show an error if the siteId is not specified', function(done) {
        api.resetConnection('appKey=278d425bdf160c739803&signature=a9e5563f04ed2812d10c057b4f1a8d68136e64fac3f60acad094a66ae533cdb2', {
            appKey: '278d425bdf160c739803',
            signature: 'a9e5563f04ed2812d10c057b4f1a8d68136e64fac3f60acad094a66ae533cdb2'
        });

        api.specHelper.runAction('schedule', api.testConnections.testConnection, function(response) {
            response.error.should.be.equal('siteId is a required parameter for this action.');
            response.messageCount.should.be.equal(1);

            done();
        });
    });

    it('should show an error if the siteId parameter has an invalid value', function(done) {
        api.resetConnection('siteId=-1&appKey=278d425bdf160c739803&signature=2bf503328099f2bb4763f669c3d1a59743dd07e8837502d8059d4892711f16e0', {
            siteId: -1,
            appKey: '278d425bdf160c739803',
            signature: '2bf503328099f2bb4763f669c3d1a59743dd07e8837502d8059d4892711f16e0'
        });

        api.specHelper.runAction('schedule', api.testConnections.testConnection, function(response) {
            response.error.should.be.equal('The Site ID provided is not valid.');
            response.messageCount.should.be.equal(1);

            done();
        });
    });

    it('should show an error if the removed parameter has an invalid value', function(done) {
        api.resetConnection('siteId=1&removed&appKey=278d425bdf160c739803&signature=b79134b3c42845a54c4c4f56e19ac76e325f3d42aa4b77c997134bc05d7a7c5f', {
            siteId: 1,
            removed: '',
            appKey: '278d425bdf160c739803',
            signature: 'b79134b3c42845a54c4c4f56e19ac76e325f3d42aa4b77c997134bc05d7a7c5f'
        });

        api.specHelper.runAction('schedule', api.testConnections.testConnection, function(response) {
            response.error.should.be.equal('The removed parameter provided is not valid.');
            response.messageCount.should.be.equal(1);

            done();
        });
    });

    it('should show an error if there are no schedules that match the parameters provided', function(done) {
        api.resetConnection('siteId=99&appKey=278d425bdf160c739803&signature=9cc2e0666d36423435ba90432d6f842ad24d90948994ebce6fbd1fd57318026d', {
            siteId: 99,
            appKey: '278d425bdf160c739803',
            signature: '9cc2e0666d36423435ba90432d6f842ad24d90948994ebce6fbd1fd57318026d'
        });

        api.specHelper.runAction('schedule', api.testConnections.testConnection, function(response) {
            response.error.should.be.equal('There are no schedules that match the parameters provided.');
            response.messageCount.should.be.equal(1);

            done();
        });
    });

    it('should show the array of schedules for a valid appKey, siteId and signature', function(done) {
        api.resetConnection('siteId=20&appKey=278d425bdf160c739803&signature=066c9e594817038dd3c6c46c62799c9ff808a44ebfb2415fe8458b23a5155681', {
            siteId: 20,
            appKey: '278d425bdf160c739803',
            signature: '066c9e594817038dd3c6c46c62799c9ff808a44ebfb2415fe8458b23a5155681'
        });

        api.specHelper.runAction('schedule', api.testConnections.testConnection, function(response) {
            should(response.error).be.Undefined('error');
            response.messageCount.should.be.equal(1);

            response.schedules.should.be.Array();
            response.schedules.length.should.be.equal(5);
            response.schedules.forEach((schedule) => {
                schedule.should.have.properties([
                    'scheduleId',
                    'siteId',
                    'name',
                    'scheduleType',
                    'curveType',
                    'runOnHolidays',
                    'season',
                    'disabled',
                    'updatedUserId',
                    'lastUpdated',
                    'removed'
                ]);
            });

            done();
        });
    });

    it('should show the array of non removed schedules for a valid appKey, siteId and signature', function(done) {
        api.resetConnection('siteId=20&removed=no&appKey=278d425bdf160c739803&signature=91a6a5a9ffa732b90541a79e99073adb05ae27346c07cd27aad508a975c4f85b', {
            siteId: 20,
            removed: 'no',
            appKey: '278d425bdf160c739803',
            signature: '91a6a5a9ffa732b90541a79e99073adb05ae27346c07cd27aad508a975c4f85b'
        });

        api.specHelper.runAction('schedule', api.testConnections.testConnection, function(response) {
            should(response.error).be.Undefined('error');
            response.messageCount.should.be.equal(1);

            response.schedules.should.be.Array();
            response.schedules.length.should.be.equal(4);
            response.schedules.forEach((schedule) => {
                schedule.should.have.properties([
                    'scheduleId',
                    'siteId',
                    'name',
                    'scheduleType',
                    'curveType',
                    'runOnHolidays',
                    'season',
                    'disabled',
                    'updatedUserId',
                    'lastUpdated',
                    'removed'
                ]);
            });

            done();
        });
    });
});
