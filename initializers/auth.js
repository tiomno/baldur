'use strict';

module.exports = {
    loadPriority:  1001,

    initialize: function(api, next) {
        let authenticationMiddleware = {
            name: 'authentication Middleware',
            global: true,
            preProcessor: function(data, next) {
                if(data.actionTemplate.authenticate === true) {
                    api.signature.authenticate(data, function(error) {
                        next(error);
                    });
                } else {
                    next();
                }
            }
        };

        api.actions.addMiddleware(authenticationMiddleware);

        next();
    }
};
