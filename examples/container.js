var winston = require('winston');

// load transport, but do not attach it yet
var PosixSyslog = require('../lib/winston-posix-syslog').PosixSyslog;

// 
winston.loggers.add('node-posix-logger', {
    console: {
        level: 'silly',
        colorize: 'true',
        label: 'node-posix-logger'
    },
    PosixSyslog : {
    	level: 'silly',
    	colorize: 'true',
    	label: 'node-posix-logger',
        identity: 'node-logger'
    }
});

var logger = winston.loggers.get('node-posix-logger');

logger.debug('debug message');
logger.info('info message.');
logger.error('error message');
