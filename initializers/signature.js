'use strict';

const crypto = require('crypto');

module.exports = {
    loadPriority:  1000,

    initialize: function(api, next) {
        api.signature = {

            authenticate: function(data, next) {
                this.parseQueryStringBody(data, (error, querystring) => {
                    if(error) {
                        next(error);
                    } else {
                        data.params.body = querystring;

                        this.validateAppKey(data, (error, privateKey) => {
                            if(error) {
                                next(error);
                            } else {
                                data.params.privateKey = privateKey;

                                this.validateSignature(data, (error) => {
                                    next(error);
                                });
                            }
                        });
                    }
                });
            },

            parseQueryStringBody: function(data, next) {
                const parseQueryString = data.connection.rawConnection.parsedURL.search.match(/^\?(.*)&signature/);

                if(parseQueryString === null) {
                    next(new Error(data.connection.localize('The parameters of the request are not well formed.')));
                } else {
                    next(null, parseQueryString[1]);
                }
            },

            validateAppKey: function(data, next) {
                if(!data.params.appKey) {
                    next(new Error(data.connection.localize('The appKey value is a required parameter.')));
                } else {
                    api.models.app.findOne({
                        where: {
                            appKey: data.params.appKey,
                            enabled: true
                        }
                    }).then((app) => {
                        if(!app) {
                            next(new Error(data.connection.localize('No app matches the appKey provided.')));
                        } else {
                            next(null, app.privateKey);
                        }
                    }).catch((error) => {
                        next(error);
                    });
                }
            },

            validateSignature: function(data, next) {
                const hash = crypto.createHmac('sha256', data.params.privateKey).update(data.params.body).digest('hex');

                if(hash === data.params.signature) {
                    next();
                } else {
                    next(new Error(data.connection.localize('The signature is not valid.')));
                }
            }
        };

        next();
    }

};
