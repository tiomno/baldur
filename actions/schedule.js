/**
 * Schedule action to read info from connecDIMCloud.Schedule table
 */
'use strict';

const inputs =  {
    siteId: {
        required: true,
        validator: function(param, data) {
            if(parseInt(param) > 0) {
                return true;
            } else {
                return new Error(data.connection.localize('The Site ID provided is not valid.'));
            }
        },
        formatter: function(param) {
            return parseInt(param);
        }
    },
    removed: {
        required: false,
        validator: function(param, data) {
            if(['1', '0', 'true', 'false', 'yes', 'no'].indexOf(String(data.connection.rawConnection.parsedURL.query.removed).toLowerCase()) === -1) {
                return new Error(data.connection.localize('The removed parameter provided is not valid.'));
            } else {
                return true;
            }
        },
        formatter: function(param) {
            return ['0', 'false', 'no'].indexOf(String(param).toLowerCase()) === -1;
        }
    }
};

const outputExample = {
    scheduleId: 1,
    siteId: 20,
    name: 'Schedule name',
    scheduleType: 'curve',
    curveType: ['level', 'xy'],
    scheduleTimes: null,
    scheduleCommands: null,
    curveFrequency: [], /* //TODO &&& array of objects/NULL if scheduleType = command From ScheduleTime table (check structure with Ken) */
    curveTargets: [], /* //TODO &&& array of objects/NULL if scheduleType = command. From ScheduleCommand table (check structure with Ken) */
    curvePoints: [], /* //TODO &&& array of objects/NULL if scheduleType = command, From ScheduleCurvePoint table (check structure with Ken) */
    season: {
        start: {
            month: 0,
            date: 18
        },
        end: {
            month: 11,
            date: 20
        }
    },
    runOnHolidays: false
};

exports.action = {
    name: 'schedule',
    description: 'Returns connecDIM Schedules data',
    blockedConnectionTypes: [],
    outputExample: outputExample,
    matchExtensionMimeType: false,
    version: '0.1.0',
    toDocument: true,
    authenticate: true, // Important to get the action authenticated!
    middleware: [],

    inputs: inputs,

    run: function(api, data, next) {
        let params = {
            siteId: data.params.siteId
        };

        if(typeof data.params.removed !== 'undefined') {
            params.removed = data.params.removed;
        }

        api.models.schedule.findAll({
            where: params
        }).then(function(schedules) {
            let error = null;

            data.response.schedules = schedules;

            if(schedules.length === 0) {
                error = new Error(data.connection.localize('There are no schedules that match the parameters provided.'));
            }

            next(error);
        }).catch(function(error) {
            next(error);
        });
    }
};
