/**
 * @thanks https://gist.github.com/crrobinson14/2251a45045e90ee81cc34111bc00b811
 */
'use strict';

process.env.NODE_ENV = 'test';

const ActionheroPrototype = require('actionhero').actionheroPrototype;
const actionhero = new ActionheroPrototype();
const url = require('url');
let running = false;

global.api = null;

global.bootstrap = {
    init: function(done) {
        actionhero.start(function(err, api) {
            running = true;

            if(err) {
                throw err;
            }

            global.api = api;

            // Set up anonymous and authenticated test user connections for calling API actions
            api.resetConnection = function(queryString, params) {
                queryString = queryString || '';

                api.testConnections = {};
                api.testConnections.testConnection = new api.specHelper.connection();
                api.testConnections.testConnection.rawConnection.parsedURL = url.parse('http://localhost/api?' + queryString, true);
                api.testConnections.testConnection.rawConnection.req = {
                    headers: {}
                };

                if(typeof params == 'object') {
                    api.testConnections.testConnection.params = params;
                }
            };

            // Wait for an async message to be sent/broadcast to us
            api.awaitMessage = function(connection, messageType, maxWait, callback) {
                const maxTime = new Date().getTime() + maxWait;
                let cancel;

                function check() {
                    if(new Date().getTime() > maxTime) {
                        clearInterval(cancel);
                        api.log('Timeout waiting for ' + messageType, 'info');
                        callback(null);
                    }

                    connection.messages.some(function(message) {
                        if(message.message && message.message.type && message.message.type === messageType) {
                            clearInterval(cancel);
                            callback(message);

                            return true;
                        }
                    });
                }

                cancel = setInterval(check, 100);
                cancel.unref();
            };

            // Pretend we've had a database failure
            Object.keys(api.models).map(function(modelName) {
                api.models[modelName].shouldFail = false;
                api.models[modelName].beforeCreate(function(instance, options, callback) {
                    if(api.models[modelName].shouldFail) {
                        api.expectingOrmError = true;
                        callback(api.orm.queryError('Unable to process request.'));
                    } else {
                        callback();
                    }
                });

                api.models[modelName].beforeBulkCreate(function(instance, options, callback) {
                    if(api.models[modelName].shouldFail) {
                        api.expectingOrmError = true;
                        callback(api.orm.queryError('Unable to process request.'));
                    } else {
                        callback();
                    }
                });

                api.models[modelName].beforeFind(function(options, callback) {
                    if(api.models[modelName].shouldFail) {
                        api.expectingOrmError = true;
                        callback(api.orm.queryError('Unable to process request.'));
                    } else {
                        callback();
                    }
                });
            });

            done();
        });
    },

    teardown: function(done) {
        if(running) {
            actionhero.stop(function() {
                delete global.api;
                delete global.should;
            });
        }

        done();
    }
};
