/*
Logging module
 */


module.exports = function(dep){

    return function (callback) {
        var winston = require('winston');
        var MongoDB = require('winston-mongodb').MongoDB;

        var logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)({
                    colorize: true,
                    silent: false,
                    handleExceptions: true,
                    humanReadableUnhandledException: true
                }),
                new(winston.transports.MongoDB)({
                    name: 'mongo-error',
                    db : `mongodb://localhost/workalley`,
                    collection: 'logs',
                    level: 'error',
                    handleExceptions: true,
                    silent: false
                })
            ]
        });
        callback(null, logger);
    }


};