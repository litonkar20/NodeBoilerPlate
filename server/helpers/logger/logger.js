"use strict";

const winston = require("winston");
const fs = require('fs');
require('winston-daily-rotate-file');

const envConfig = require('../config/utilsconfig');
const defaultLoggerLevel = envConfig.EnvConfiguration().loggerLevel;
const loggerLevel = process.env.Log_Level || defaultLoggerLevel;

const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const config = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'blue',
    }
};

winston.addColors(config.colors);

const options = {
    level: loggerLevel,
    handleExceptions: true,
    json: true,
    colorize: true
};

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
    filename: `${logDir}/%DATE%-nodeBoiler.log`,
    datePattern: 'YYYY-MM-DD',
    level: loggerLevel,
    handleExceptions: true,
    json: true,
    colorize: true
});


const logger = winston.createLogger({
    levels: config.levels,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => `${info.timestamp} ${info.level} :: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console(options),
        dailyRotateFileTransport
    ],
    exitOnError: false,
    prettyPrint: true
})


module.exports = logger;