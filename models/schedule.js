/**
 * Model for Schedule DB table
 */
'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Schedule', {
        scheduleId: {
            type: DataTypes.INTEGER,
            field: 'ScheduleID',
            allowNull: false,
            primaryKey: true // Important to prevent sequelize uses `id` as primary key!!!
        },
        siteId: {
            type: DataTypes.INTEGER,
            field: 'SiteID',
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            field: 'Name',
            allowNull: false
        },
        scheduleType: {
            type: DataTypes.ENUM('command','curve'),
            field: 'ScheduleType',
            allowNull: false
        },
        curveType: {
            type: DataTypes.ENUM('level','temp','xy'),
            field: 'CurveType',
            allowNull: false
        },
        runOnHolidays: {
            type: DataTypes.BOOLEAN,
            field: 'RunOnHolidays',
            allowNull: false
        },
        season: {
            type: DataTypes.STRING(100),
            field: 'Season',
            allowNull: true
        },
        disabled: {
            type: DataTypes.BOOLEAN,
            field: 'Disabled',
            allowNull: false
        },
        updatedUserId: {
            type: DataTypes.INTEGER,
            field: 'UpdatedUserID',
            allowNull: false
        },
        lastUpdated: {
            type: DataTypes.DATE,
            field: 'LastUpdated',
            allowNull: false
        },
        removed: {
            type: DataTypes.BOOLEAN,
            field: 'Removed',
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // Important for sequelize not to try to pluralise the DAO name!!!
    })
};
