/**
 * Model for App DB table
 */
'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('App', {
        appId: {
            type: DataTypes.INTEGER,
            field: 'AppID',
            allowNull: false,
            primaryKey: true // Important to prevent sequelize uses `id` as primary key!!!
        },
        accountId: {
            type: DataTypes.INTEGER,
            field: 'AccountID',
            allowNull: false
        },
        appName: {
            type: DataTypes.STRING(255),
            field: 'AppName',
            allowNull: false
        },
        siteRankId: {
            type: DataTypes.INTEGER,
            field: 'SiteRankID',
            allowNull: false
        },
        appKey: {
            type: DataTypes.STRING(50),
            field: 'AppKey',
            allowNull: false
        },
        privateKey: {
            type: DataTypes.STRING(50),
            field: 'PrivateKey',
            allowNull: false
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            field: 'Enabled',
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true // Important for sequelize not to try to pluralise the DAO name!!!
    })
};
