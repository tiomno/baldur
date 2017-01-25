'use strict';

exports['default'] = {
    sequelize: function(api) {
        return {
            autoMigrate: true,
            loadFixtures: false,
            database: 'connecDIMCloud',
            dialect: 'mysql',
            port: 3306,
            host: '146.108.214.5',
            username: 'connecdim_admin',
            password: 'VhZ4rnyJpbwQB5K5'
        };
    }
};

let merge = function(overlayFn) {
    let mergeObj = {};
    let attrname;
    let aSequelize = exports.default.sequelize();

    for(attrname in aSequelize) {
        if(aSequelize.hasOwnProperty(attrname)) {
            mergeObj[attrname] = exports.default.sequelize()[attrname];
        }
    }

    if(typeof (overlayFn) !== 'undefined') {
        aSequelize = overlayFn.sequelize();

        for(attrname in aSequelize) {
            if(aSequelize.hasOwnProperty(attrname)) {
                mergeObj[attrname] = overlayFn.sequelize()[attrname];
            }
        }
    }

    // Map over AH's sequelize fn
    mergeObj.sequelize = overlayFn.sequelize;

    return mergeObj;
};

// For sequelize-cli
// Add to the exports below, if you have setup additional environment-specific settings

exports.test = merge({
    sequelize: function(api) {
        return {
            port: 33068,
            host: '127.0.0.1',
            username: 'connecdim_cirunner',
            password: 'cipassword'
        };
    }
});
exports.development = merge({
    sequelize: function(api) {
        return {
            port: 33068,
            host: '127.0.0.1',
            username: 'connecdim_cirunner',
            password: 'cipassword'
        };
    }
});
//exports.production = merge(exports.production);


// You can define even more elaborate configurations (including replication).
// See http://sequelize.readthedocs.org/en/latest/api/sequelize/index.html for more information
// For example:

// exports.production = {
//   sequelize: function(api){
//     return {
//       "autoMigrate" : false,
//       "loadFixtures": false,
//       "logging"     : false,
//       "database"    : "PRODUCTION_DB",
//       "dialect"     : "mysql",
//       "port"        : 3306,
//       "replication" : {
//         "write": {
//           "host"     : "127.0.0.1",
//           "username" : "root",
//           "password" : "",
//           "pool"     : {}
//         },
//         "read": [
//           {
//             "host"     : "127.0.0.1",
//             "username" : "root",
//             "password" : "",
//             "pool"     : {}
//           }
//         ]
//       }
//     }
//   }
// }
