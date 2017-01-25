// error messages can be strings of objects
var util = require('util');

exports['default'] = {
    errors: function(api) {
        return {
            _toExpand: false,

            /////////////////
            // SERIALIZERS //
            /////////////////

            serializers: {
                servers: {
                    web: function(error) {
                        if(util.isError(error)) {
                            return String(error.message);
                        } else {
                            return error;
                        }
                    },
                    websocket: function(error) {
                        if(util.isError(error)) {
                            return String(error.message);
                        } else {
                            return error;
                        }
                    },
                    socket: function(error) {
                        if(util.isError(error)) {
                            return String(error.message);
                        } else {
                            return error;
                        }
                    },
                    specHelper: function(error) {
                        if(util.isError(error)) {
                            return String(error.message);
                        } else {
                            return error;
                        }
                    }
                }
            },

            /////////////
            // ACTIONS //
            /////////////

            // When a params for an action is invalid
            invalidParams: function(data, validationErrors) {
                if(validationErrors.length >= 0) {
                    return validationErrors[0];
                }

                return 'validation error';
            },

            // When a required param for an action is not provided
            missingParams: function(data, missingParams) {
                return data.connection.localize(['%s is a required parameter for this action.', missingParams[0]]);
            },

            // user requested an unknown action
            unknownAction: function(data) {
                return data.connection.localize('Unknown action or invalid apiVersion.');
            },

            // action not usable by this client/server type
            unsupportedServerType: function(data) {
                return data.connection.localize(['This action does not support the %s connection type.', data.connection.type]);
            },

            // action failed because server is mid-shutdown
            serverShuttingDown: function(data) {
                return data.connection.localize('The server is shutting down.');
            },

            // action failed because this client already has too many pending actions
            // limit defined in api.config.general.simultaneousActions
            tooManyPendingActions: function(data) {
                return data.connection.localize('You have too many pending requests.');
            },

            dataLengthTooLarge: function(maxLength, receivedLength) {
                return api.i18n.localize(['data length is too big (%u received/%u max)', maxLength, receivedLength]);
            },

            /////////////////
            // FILE SERVER //
            /////////////////

            // The body message to accompany 404 (file not found) errors regarding flat files
            // You may want to load in the content of 404.html or similar
            fileNotFound: function(connection) {
                return connection.localize(['That file is not found (%s).', connection.params.file]);
            },

            // user didn't request a file
            fileNotProvided: function(connection) {
                return connection.localize('file is a required param to send a file.');
            },

            // something went wrong trying to read the file
            fileReadError: function(connection, error) {
                return connection.localize(['Error reading file: %s.', String(error)]);
            },

            /////////////////
            // CONNECTIONS //
            /////////////////

            verbNotFound: function(connection, verb) {
                return connection.localize(['I do not know how to perform this verb (%s).', verb]);
            },

            verbNotAllowed: function(connection, verb) {
                return connection.localize(['Verb not found or not allowed (%s).', verb]);
            },

            connectionRoomAndMessage: function(connection) {
                return connection.localize('Both room and message are required.');
            },

            connectionNotInRoom: function(connection, room) {
                return connection.localize(['Connection not in this room (%s).', room]);
            },

            connectionAlreadyInRoom: function(connection, room) {
                return connection.localize(['Connection already in this room (%s).', room]);
            },

            connectionRoomHasBeenDeleted: function(room) {
                return api.i18n.localize('This room has been deleted.');
            },

            connectionRoomNotExist: function(room) {
                return api.i18n.localize('Room does not exist.');
            },

            connectionRoomExists: function(room) {
                return api.i18n.localize('Room exists.');
            },

            connectionRoomRequired: function(room) {
                return api.i18n.localize('A room is required.');
            }

        };
    }
};
