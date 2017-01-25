/**
 * Initializer for MySQL connection and load of DB models.
 */
'use strict';

const Sequelize = require('sequelize');

module.exports = {
    loadPriority:  1002,
    startPriority: 1002,
    stopPriority:  1002,

    start: function(api, next) {
        api.sequelize = new Sequelize(api.config.sequelize.database, api.config.sequelize.username, api.config.sequelize.password, api.config.sequelize);

        api.models = {
            app: api.sequelize.import(__dirname + '/../models/app.js'),
            schedule: api.sequelize.import(__dirname + '/../models/schedule.js')
            /* //TODO &&& load the rest of the modules here */
        };

        next();
    },

    stop: function(api, next) {
        api.sequelize.close();
        next();
    }
};
